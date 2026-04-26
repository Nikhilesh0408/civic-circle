import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const AIAssistant = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
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
  const inputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Exact same color system as AIChatbot.js
  const navy = {
    900: '#0b1730',
    800: '#0f1f3d',
    700: '#162a52',
    600: '#1e3a6e',
    500: '#2451a3',
  };
  const accent = '#3b82f6';
  const accentLight = 'rgba(59,130,246,0.15)';

  const chatBg    = darkMode ? navy[900] : '#f0f4ff';
  const msgBg     = darkMode ? navy[700] : '#e8eeff';
  const inputBg   = darkMode ? navy[800] : '#ffffff';
  const borderC   = darkMode ? navy[600] : '#c7d7f5';
  const textMain  = darkMode ? '#e8eeff' : '#0f1f3d';
  const textMuted = darkMode ? '#8ba3cc' : '#4a6094';

  return (
    <div style={{
      minHeight: '100vh', background: chatBg, color: textMain,
      fontFamily: "'Inter', sans-serif", display: 'flex',
      flexDirection: 'column', transition: 'background 0.5s',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e3a6e; border-radius: 4px; }
        .nav-ghost:hover { background: rgba(255,255,255,0.08) !important; }
        .quick-btn:hover { border-color: #3b82f6 !important; color: #3b82f6 !important; background: rgba(59,130,246,0.15) !important; }
        .suggest-btn:hover { border-color: #3b82f6 !important; color: #93c5fd !important; background: rgba(59,130,246,0.15) !important; }
        .chat-textarea { font-family: 'Inter', sans-serif; outline: none; resize: none; }
        .chat-textarea:focus { border-color: #3b82f6 !important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 40px', height: 64, flexShrink: 0,
        background: darkMode ? navy[800] : '#ffffff',
        borderBottom: `1px solid ${borderC}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            width: 32, height: 32,
            background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>⚖️</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: darkMode ? '#ffffff' : navy[900] }}>
            Civic Circle
          </span>
        </div>

        {/* Online badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: darkMode ? navy[700] : '#dce8ff',
          border: `1px solid ${borderC}`, padding: '6px 14px', borderRadius: 20,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: darkMode ? '#93c5fd' : navy[500] }}>
            AI Legal Assistant • Online
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="nav-ghost" onClick={() => setDarkMode(!darkMode)} style={{
            padding: '7px 14px', borderRadius: 6, border: `1px solid ${borderC}`,
            color: textMuted, fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
          <button className="nav-ghost" onClick={clearChat} style={{
            padding: '7px 14px', borderRadius: 6,
            border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>Clear Chat</button>
          <button className="nav-ghost" onClick={() => navigate(user ? '/client-dashboard' : '/')} style={{
            padding: '7px 14px', borderRadius: 6, border: `1px solid ${borderC}`,
            color: textMuted, fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>← Back</button>
        </div>
      </nav>

      {/* ── LANGUAGE BANNER — exact same as AIChatbot ── */}
      <div style={{
        background: darkMode ? navy[800] : '#dce8ff',
        padding: '7px 20px', textAlign: 'center',
        fontSize: 12, color: textMuted,
        borderBottom: `1px solid ${borderC}`, flexShrink: 0,
        letterSpacing: '0.03em',
      }}>
        🌐 English • हिंदी • ಕನ್ನಡ • தமிழ் • తెలుగు • മലയാളം
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{
        display: 'flex', flex: 1, overflow: 'hidden',
        maxWidth: 1100, margin: '0 auto', width: '100%',
        padding: '20px 20px 0', gap: 20,
      }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 20 }}>

          <div style={{
            background: darkMode ? navy[800] : '#ffffff',
            border: `1px solid ${borderC}`, borderRadius: 12, padding: '18px 16px',
          }}>
            <div style={{
              width: 44, height: 44,
              background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, marginBottom: 12, boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
            }}>⚖️</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: darkMode ? '#e8eeff' : navy[900], marginBottom: 6 }}>
              AI Legal Assistant
            </p>
            <p style={{ fontSize: 12, color: textMuted, lineHeight: 1.6 }}>
              Ask any legal question in any Indian language. Available 24/7.
            </p>
          </div>

          <div style={{
            background: darkMode ? navy[800] : '#ffffff',
            border: `1px solid ${borderC}`, borderRadius: 12, padding: '16px',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: accent, marginBottom: 12 }}>
              Try asking
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickQuestions.map((q, i) => (
                <button key={i} className="suggest-btn"
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  style={{
                    background: 'transparent', border: `1px solid ${borderC}`,
                    borderRadius: 8, padding: '8px 10px', textAlign: 'left',
                    fontSize: 12, color: textMuted, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', lineHeight: 1.45, transition: 'all 0.2s',
                  }}
                >{q.length > 32 ? q.substring(0, 32) + '…' : q}</button>
              ))}
            </div>
          </div>

          <div style={{
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 12, padding: '12px 14px',
          }}>
            <p style={{ fontSize: 11, color: '#f87171', lineHeight: 1.65 }}>
              ⚠️ <strong>Disclaimer:</strong> This AI provides general legal information only — not legal advice. Always consult a qualified lawyer for your specific case.
            </p>
          </div>

          <button onClick={() => navigate('/search')} style={{
            padding: '10px', background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
            color: '#ffffff', border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
          }}>🔍 Find a Real Lawyer</button>
        </div>

        {/* ── CHAT AREA ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '0 4px 16px',
            display: 'flex', flexDirection: 'column', gap: 12,
            scrollbarWidth: 'thin', scrollbarColor: `${navy[600]} transparent`,
          }}>
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start', gap: 8,
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, flexShrink: 0, marginTop: 2,
                      boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
                    }}>⚖️</div>
                  )}
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                      fontSize: 14, lineHeight: 1.65,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                      background: msg.role === 'user'
                        ? `linear-gradient(135deg, ${accent}, #1d4ed8)` : msgBg,
                      color: msg.role === 'user' ? '#ffffff' : textMain,
                      boxShadow: msg.role === 'user'
                        ? '0 4px 12px rgba(59,130,246,0.3)' : '0 2px 8px rgba(0,0,0,0.12)',
                      border: msg.role === 'assistant' ? `1px solid ${borderC}` : 'none',
                    }}>{msg.content}</div>
                  </div>
                  {msg.role === 'user' && (
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', background: '#0d5f3a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#ffffff', flexShrink: 0, marginTop: 2,
                    }}>
                      {user?.name ? user.name[0].toUpperCase() : '👤'}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator — exact same animation as AIChatbot */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
                }}>⚖️</div>
                <div style={{
                  padding: '12px 16px', borderRadius: '12px 12px 12px 4px',
                  background: msgBg, border: `1px solid ${borderC}`,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: accent }}
                      animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                  <span style={{ fontSize: 12, color: textMuted, marginLeft: 4 }}>Thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions — shown only at start */}
          {messages.length === 1 && (
            <div style={{ padding: '10px 4px 12px', borderTop: `1px solid ${borderC}` }}>
              <p style={{ fontSize: 11, color: textMuted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick questions
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {quickQuestions.map((q, i) => (
                  <button key={i} className="quick-btn"
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    style={{
                      fontSize: 12, padding: '6px 12px', borderRadius: 20,
                      border: `1px solid ${borderC}`, background: 'transparent',
                      color: textMuted, cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                    }}
                  >{q.length > 30 ? q.substring(0, 30) + '…' : q}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── INPUT BAR ── */}
          <div style={{ paddingBottom: 20, paddingTop: 12, borderTop: `1px solid ${borderC}` }}>
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-end',
              background: inputBg, border: `1px solid ${borderC}`,
              borderRadius: 12, padding: '10px 14px',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask in any language… / ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ…"
                rows={2}
                className="chat-textarea"
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  padding: '4px 0', fontSize: 14, color: textMain, lineHeight: 1.55,
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={loading || !input.trim()}
                style={{
                  padding: '8px 20px', borderRadius: 8, border: 'none',
                  background: loading || !input.trim()
                    ? navy[600]
                    : `linear-gradient(135deg, ${accent}, #1d4ed8)`,
                  color: loading || !input.trim() ? '#4a6094' : '#ffffff',
                  fontWeight: 700, fontSize: 14,
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: loading || !input.trim() ? 'none' : '0 4px 12px rgba(59,130,246,0.35)',
                  transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
                }}
              >Send</motion.button>
            </div>
            <p style={{ fontSize: 11, color: textMuted, textAlign: 'center', marginTop: 8 }}>
              For serious matters, consult a verified lawyer on Civic Circle
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;