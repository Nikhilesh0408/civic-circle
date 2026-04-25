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

  const navy = {
    900: '#0b1730',
    800: '#0f1f3d',
    700: '#162a52',
    600: '#1e3a6e',
    500: '#2451a3',
  };
  const accent = '#3b82f6';
  const accentHover = '#2563eb';
  const accentLight = 'rgba(59,130,246,0.15)';

  const chatBg    = darkMode ? navy[900] : '#f0f4ff';
  const msgBg     = darkMode ? navy[700] : '#e8eeff';
  const inputBg   = darkMode ? navy[800] : '#ffffff';
  const borderC   = darkMode ? navy[600] : '#c7d7f5';
  const textMain  = darkMode ? '#e8eeff' : '#0f1f3d';
  const textMuted = darkMode ? '#8ba3cc' : '#4a6094';

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 50,
          width: '3.75rem',
          height: '3.75rem',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
          boxShadow: `0 8px 32px rgba(59,130,246,0.45)`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          color: '#fff',
        }}
        animate={{
          boxShadow: isOpen
            ? `0 0 0 4px ${accentLight}, 0 8px 32px rgba(59,130,246,0.4)`
            : [
                `0 0 0 0px ${accentLight}, 0 8px 24px rgba(59,130,246,0.3)`,
                `0 0 0 8px rgba(59,130,246,0.08), 0 8px 32px rgba(59,130,246,0.5)`,
                `0 0 0 0px ${accentLight}, 0 8px 24px rgba(59,130,246,0.3)`,
              ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: '6rem',
              right: '1.5rem',
              zIndex: 50,
              width: '24rem',
              height: '600px',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: chatBg,
              border: `1px solid ${borderC}`,
              boxShadow: `0 24px 64px rgba(11,23,48,0.55), 0 0 0 1px rgba(59,130,246,0.15)`,
            }}
          >
            {/* Header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${navy[800]} 0%, ${navy[700]} 100%)`,
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: `1px solid ${navy[600]}`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
                }}
              >
                ⚖️
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.01em' }}>
                  AI Legal Assistant
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ color: '#8ba3cc', fontSize: '0.7rem' }}>Online • Civic Circle</span>
                </div>
              </div>

              <button
                onClick={clearChat}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#8ba3cc',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.75rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(59,130,246,0.2)'; e.target.style.color = '#93c5fd'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = '#8ba3cc'; }}
              >
                Clear
              </button>
            </div>

            {/* Language Banner */}
            <div
              style={{
                background: darkMode ? navy[800] : '#dce8ff',
                padding: '0.4rem 1rem',
                textAlign: 'center',
                fontSize: '0.68rem',
                color: textMuted,
                borderBottom: `1px solid ${borderC}`,
                flexShrink: 0,
                letterSpacing: '0.02em',
              }}
            >
              🌐 English • हिंदी • ಕನ್ನಡ • தமிழ் • తెలుగు • മലയാളം
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                scrollbarWidth: 'thin',
                scrollbarColor: `${navy[600]} transparent`,
              }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div
                      style={{
                        width: '1.75rem',
                        height: '1.75rem',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        flexShrink: 0,
                        marginTop: '0.1rem',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
                      }}
                    >
                      ⚖️
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '0.6rem 0.9rem',
                      borderRadius: msg.role === 'user'
                        ? '1rem 1rem 0.2rem 1rem'
                        : '1rem 1rem 1rem 0.2rem',
                      fontSize: '0.82rem',
                      lineHeight: '1.55',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      background: msg.role === 'user'
                        ? `linear-gradient(135deg, ${accent}, #1d4ed8)`
                        : msgBg,
                      color: msg.role === 'user' ? '#fff' : textMain,
                      boxShadow: msg.role === 'user'
                        ? '0 4px 12px rgba(59,130,246,0.3)'
                        : '0 2px 8px rgba(0,0,0,0.15)',
                      border: msg.role === 'assistant' ? `1px solid ${borderC}` : 'none',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}
                >
                  <div
                    style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      flexShrink: 0,
                    }}
                  >
                    ⚖️
                  </div>
                  <div
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '1rem 1rem 1rem 0.2rem',
                      background: msgBg,
                      border: `1px solid ${borderC}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        style={{
                          width: '0.45rem',
                          height: '0.45rem',
                          borderRadius: '50%',
                          background: accent,
                        }}
                        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18 }}
                      />
                    ))}
                    <span style={{ fontSize: '0.72rem', color: textMuted, marginLeft: '0.25rem' }}>
                      Thinking...
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div
                style={{
                  padding: '0.5rem 1rem 0.6rem',
                  background: chatBg,
                  borderTop: `1px solid ${borderC}`,
                  flexShrink: 0,
                }}
              >
                <p style={{
                  fontSize: '0.68rem',
                  color: textMuted,
                  margin: '0 0 0.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Quick questions
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '999px',
                        border: `1px solid ${borderC}`,
                        background: 'transparent',
                        color: textMuted,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.target.style.borderColor = accent;
                        e.target.style.color = accent;
                        e.target.style.background = accentLight;
                      }}
                      onMouseLeave={e => {
                        e.target.style.borderColor = borderC;
                        e.target.style.color = textMuted;
                        e.target.style.background = 'transparent';
                      }}
                    >
                      {q.length > 25 ? q.substring(0, 25) + '…' : q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderTop: `1px solid ${borderC}`,
                background: darkMode ? navy[800] : '#fff',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask in any language… / ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ…"
                  rows={2}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.85rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${borderC}`,
                    background: inputBg,
                    color: textMain,
                    fontSize: '0.82rem',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: '1.5',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = accent; }}
                  onBlur={e => { e.target.style.borderColor = borderC; }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: loading || !input.trim()
                      ? navy[600]
                      : `linear-gradient(135deg, ${accent}, #1d4ed8)`,
                    color: loading || !input.trim() ? '#4a6094' : '#fff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: loading || !input.trim()
                      ? 'none'
                      : '0 4px 12px rgba(59,130,246,0.35)',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Send
                </motion.button>
              </div>
              <p style={{
                fontSize: '0.65rem',
                color: textMuted,
                textAlign: 'center',
                margin: '0.4rem 0 0',
              }}>
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