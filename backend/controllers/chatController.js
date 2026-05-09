const axios = require('axios');
require('dotenv').config();

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

// REGULAR CHAT
const chat = async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ message: 'Message is required.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ message: 'Server configuration error: Missing API key.' });
  }

  try {
    const contents = [];

    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents,
        systemInstruction: {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );

    const candidates = response.data?.candidates;
    if (!candidates || candidates.length === 0) {
      return res.status(500).json({ message: 'AI returned an empty response. Please try again.' });
    }

    const assistantMessage = candidates[0]?.content?.parts?.[0]?.text;
    if (!assistantMessage) {
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
    if (error.response) {
      console.error('Gemini API Error:', error.response.status, JSON.stringify(error.response.data));
      if (error.response.status === 429) {
        return res.status(429).json({ message: 'AI service is busy. Please wait a moment and try again.' });
      }
    }
    return res.status(500).json({ message: 'AI service error. Please try again later.' });
  }
};

// DOCUMENT ANALYZER — using REST API directly instead of SDK
const analyzeDocument = async (req, res) => {
  const { language } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document uploaded!' });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const base64Data = fileBuffer.toString('base64');

    const languageInstruction = language && language !== 'en'
      ? `IMPORTANT: Explain everything in ${language} language. The user understands ${language} better than English.`
      : 'Explain in simple English.';

    const prompt = `You are a legal document analyzer for Civic Circle, an Indian legal assistance platform.

${languageInstruction}

Please analyze this legal document and provide:
1. Document Type — What type of legal document is this?
2. Summary — What is this document about in simple words?
3. Key Points — List the most important points in simple language
4. Important Dates — Any deadlines or important dates mentioned
5. Action Required — What does the person receiving this document need to do?
6. Rights — What are the person rights regarding this document?
7. Warning — Any concerning clauses or things to be careful about
8. Recommendation — Should they consult a lawyer? What type?

Use very simple language that a common person from rural India can understand. Avoid complex legal jargon.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const candidates = response.data?.candidates;
    if (!candidates || candidates.length === 0) {
      return res.status(500).json({ message: 'AI returned empty response. Please try again.' });
    }

    const analysis = candidates[0]?.content?.parts?.[0]?.text;
    if (!analysis) {
      return res.status(500).json({ message: 'Could not extract analysis. Please try again.' });
    }

    res.status(200).json({
      message: 'Document analyzed successfully!',
      analysis
    });

  } catch (error) {
    console.error('Document Analysis Error:', error.response?.data || error.message);
    if (error.response?.status === 429) {
      return res.status(429).json({ message: 'AI service is busy. Please wait a moment and try again.' });
    }
    res.status(500).json({ message: 'Error analyzing document. Please try again!', error: error.message });
  }
};

module.exports = { chat, analyzeDocument };