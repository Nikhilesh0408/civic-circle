import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ThemeContext } from '../App';

const AIChatbot = () => {
  const { darkMode } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hello! I am your AI Legal Assistant for Civic Circle!\n\nI can help you with legal questions in any Indian language:\n🇮🇳 English • हिंदी • ಕನ್ನಡ • தமிழ் • తెలుగు • മലയാളം\n\nAsk me anything about Indian law, your legal rights, or how to find the right lawyer!\n\nನಿಮಗೆ ಕಾನೂನು ಸಹಾಯ ಬೇಕೇ? ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ!\nकानूनी मदद चाहिए? अपनी भाषा में पूछें!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
        conversationHistory,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }]);
      setConversationHistory(res.data.conversationHistory);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting. Please try again! / ಕ್ಷಮಿಸಿ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ!'
      }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '👋 Hello! I am your AI Legal Assistant. How can I help you today?\n\nನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? / आज मैं आपकी कैसे मदद कर सकता हूं?'
    }]);
    setConversationHistory([]);
  };

  const quickQuestions = [
    'What are my rights if police arrest me?',
    'ನನ್ನ ಜಮೀನು ವಿವಾದ ಇದೆ, ಏನು ಮಾಡಬೇಕು?',
    'मुझे FIR कैसे दर्ज करें?',
    'How to file consumer complaint?',
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-yellow-400 text-black rounded-full shadow-lg flex items-center justify-center text-2xl font-bold"
        style={{ boxShadow: '0 0 25px rgba(250,204,21,0.6)' }}
        animate={{ boxShadow: isOpen ? '0 0 25px rgba(250,204,21,0.6)' : ['0 0 15px rgba(250,204,21,0.3)', '0 0 30px rgba(250,204,21,0.7)', '0 0 15px rgba(250,204,21,0.3)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isOpen ? '✕' : '⚖️'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-24 right-6 z-50 w-96 h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
            style={{ boxShadow: '0 0 40px rgba(250,204,21,0.2)' }}
          >
            {/* Header */}
            <div className="bg-yellow-400 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-yellow-400 text-xl">
                ⚖️
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-black text-lg">AI Legal Assistant</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-black text-xs opacity-70">Online • Civic Circle</p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="text-black text-xs font-bold bg-black bg-opacity-10 px-3 py-1 rounded-full hover:bg-opacity-20 transition duration-300"
              >
                Clear
              </button>
            </div>

            {/* Language Support Banner */}
            <div className={`px-4 py-2 text-xs text-center ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-yellow-50 text-gray-500'}`}>
              🌐 English • हिंदी • ಕನ್ನಡ • தமிழ் • తెలుగు • മലയാളം
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-black text-sm mr-2 mt-1 flex-shrink-0">
                      ⚖️
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-yellow-400 text-black rounded-tr-none'
                        : darkMode
                        ? 'bg-gray-800 text-white rounded-tl-none'
                        : 'bg-gray-100 text-gray-900 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-black text-sm mr-2 mt-1">
                    ⚖️
                  </div>
                  <div className={`px-4 py-3 rounded-2xl rounded-tl-none ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-yellow-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                      <span className={`text-xs ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className={`px-4 pb-2 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className={`text-xs px-3 py-1 rounded-full border transition duration-300 ${darkMode ? 'border-gray-600 text-gray-400 hover:border-yellow-400 hover:text-yellow-400' : 'border-gray-300 text-gray-600 hover:border-yellow-400 hover:text-yellow-600'}`}
                    >
                      {q.length > 25 ? q.substring(0, 25) + '...' : q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask in any language... / ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ..."
                  rows={2}
                  className={`flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:border-yellow-400 resize-none text-sm transition duration-300 ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition duration-300 disabled:opacity-50"
                >
                  Send
                </motion.button>
              </div>
              <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                For serious matters, consult a verified lawyer on Civic Circle
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;