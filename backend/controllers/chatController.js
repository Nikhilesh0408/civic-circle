const axios = require('axios');

const SYSTEM_PROMPT = `You are an AI Legal Assistant for Civic Circle, an Indian legal assistance platform built to help common people — especially from rural areas — access legal knowledge easily.

YOUR IDENTITY:
- Name: Civic Circle Legal Assistant
- Platform: Civic Circle (Indian Legal Assistance Platform)
- Purpose: Help Indian citizens understand their legal rights and find the right legal help

YOUR CORE RESPONSIBILITIES:
1. Answer ONLY questions related to Indian law, legal rights, court procedures, legal documents, and legal guidance
2. Help users understand their legal rights in simple, clear language
3. Guide users to the right type of lawyer for their problem
4. Explain legal documents and notices in simple language
5. Help users understand what steps to take in legal situations

LANGUAGE RULES (VERY IMPORTANT):
- ALWAYS detect the language the user is writing in
- ALWAYS respond in the EXACT SAME language the user writes in
- If user writes in Kannada, respond FULLY in Kannada
- If user writes in Hindi, respond FULLY in Hindi
- If user writes in Tamil, respond FULLY in Tamil
- If user writes in Telugu, respond FULLY in Telugu
- If user writes in English, respond in English
- Use simple everyday language that rural Indians can understand

STRICT RESTRICTIONS:
- ONLY answer legal questions
- Do NOT answer non-legal questions
- If asked non-legal questions, politely say you can only help with legal matters
- ALWAYS add disclaimer to consult a verified lawyer for serious matters
- ALWAYS encourage users to find a verified lawyer on Civic Circle

TOPICS YOU CAN HELP WITH:
- Property disputes and land rights
- Criminal law and FIR filing
- Family law (divorce, custody, marriage)
- Consumer rights and complaints
- Labor rights and workplace issues
- Tenant and landlord disputes
- Police rights and arrest procedures
- Court procedures and filing cases
- Legal document explanation
- RTI (Right to Information)
- Constitutional rights of Indian citizens`;

const chat = async (req, res) => {
  const { message, conversationHistory } = req.body;

  // Basic input validation
  if (!message || message.trim() === '') {
    return res.status(400).json({ message: 'Message is required.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables.');
    return res.status(500).json({ message: 'Server configuration error: Missing API key.' });
  }

  try {
    const contents = [];

    // Add conversation history (max last 10 turns to avoid token overflow)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // ✅ FIX 1: Correct model name — gemini-2.0-flash-001
    // ✅ FIX 2: systemInstruction requires a `role: "user"` wrapper
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: contents,
        systemInstruction: {
          role: 'user',                          // ✅ required field
          parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000  // 15 second timeout — prevents hanging requests
      }
    );

    // ✅ FIX 3: Safe extraction with fallback
    const candidates = response.data?.candidates;
    if (!candidates || candidates.length === 0) {
      console.error('No candidates returned from Gemini:', response.data);
      return res.status(500).json({ message: 'AI returned an empty response. Please try again.' });
    }

    const assistantMessage = candidates[0]?.content?.parts?.[0]?.text;
    if (!assistantMessage) {
      console.error('Could not extract text from Gemini response:', JSON.stringify(response.data));
      return res.status(500).json({ message: 'AI response format unexpected. Please try again.' });
    }

    return res.status(200).json({
      message: assistantMessage,
      conversationHistory: [
        ...(conversationHistory || []),
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage }
      ]
    });

  } catch (error) {
    // ✅ FIX 4: Detailed error logging so you can debug from server logs
    if (error.response) {
      console.error('Gemini API Error Status:', error.response.status);
      console.error('Gemini API Error Data:', JSON.stringify(error.response.data, null, 2));

      // Specific user-facing messages for common errors
      if (error.response.status === 400) {
        return res.status(400).json({ message: 'Invalid request to AI service. Check your message and try again.' });
      }
      if (error.response.status === 403) {
        return res.status(500).json({ message: 'AI service authentication failed. Check your GEMINI_API_KEY.' });
      }
      if (error.response.status === 429) {
        return res.status(429).json({ message: 'AI service is busy. Please wait a moment and try again.' });
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Gemini API request timed out.');
      return res.status(504).json({ message: 'AI service timed out. Please try again.' });
    } else {
      console.error('Unexpected error:', error.message);
    }

    return res.status(500).json({ message: 'AI service error. Please try again later.' });
  }
};

module.exports = { chat };