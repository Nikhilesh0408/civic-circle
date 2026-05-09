import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const AIAssistant = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('chat');

  // Chat states
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

  // Document Analyzer states
  const [document, setDocument] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [language, setLanguage] = useState('en');
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [docError, setDocError] = useState('');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocument(file);
      setAnalysis('');
      setDocError('');
      if (file.type.startsWith('image/')) {
        setDocumentPreview(URL.createObjectURL(file));
      } else {
        setDocumentPreview(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!document) {
      setDocError('Please upload a document first!');
      return;
    }
    setAnalyzing(true);
    setDocError('');
    setAnalysis('');
    try {
      const formData = new FormData();
      formData.append('document', document);
      formData.append('language', language);
      const res = await axios.post('http://localhost:5000/api/chat/analyze-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data.analysis);
    } catch (err) {
      setDocError(err.response?.data?.message || 'Error analyzing document. Please try again!');
    }
    setAnalyzing(false);
  };

  const quickQuestions = [
    'What are my rights if police arrest me?',
    'ನನ್ನ ಜಮೀನು ವಿವಾದ ಇದೆ, ಏನು ಮಾಡಬೇಕು?',
    'मुझे FIR कैसे दर्ज करें?',
    'How to file consumer complaint?',
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'Kannada', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'Hindi', name: 'हिंदी (Hindi)' },
    { code: 'Tamil', name: 'தமிழ் (Tamil)' },
    { code: 'Telugu', name: 'తెలుగు (Telugu)' },
    { code: 'Malayalam', name: 'മലയാളം (Malayalam)' },
  ];

  const navy = {
    900: '#0b1730', 800: '#0f1f3d',
    700: '#162a52', 600: '#1e3a6e', 500: '#2451a3',
  };
  const accent = '#3b82f6';
  const chatBg   = darkMode ? navy[900] : '#f0f4ff';
  const msgBg    = darkMode ? navy[700] : '#e8eeff';
  const inputBg  = darkMode ? navy[800] : '#ffffff';
  const borderC  = darkMode ? navy[600] : '#c7d7f5';
  const textMain = darkMode ? '#e8eeff' : '#0f1f3d';
  const textMuted = darkMode ? '#8ba3cc' : '#4a6094';
  const cardBg   = darkMode ? navy[800] : '#ffffff';

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
        .tab-btn:hover { background: rgba(59,130,246,0.1) !important; }
        .upload-area:hover { border-color: #3b82f6 !important; }
      `}</style>

      {/* NAVBAR */}
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
          <button className="nav-ghost" onClick={() => navigate(user ? (user.role === 'client' ? '/client-dashboard' : '/advisor-dashboard') : '/')} style={{
            padding: '7px 14px', borderRadius: 6, border: `1px solid ${borderC}`,
            color: textMuted, fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>← Back</button>
        </div>
      </nav>

      {/* LANGUAGE BANNER */}
      <div style={{
        background: darkMode ? navy[800] : '#dce8ff',
        padding: '7px 20px', textAlign: 'center',
        fontSize: 12, color: textMuted,
        borderBottom: `1px solid ${borderC}`, flexShrink: 0,
        letterSpacing: '0.03em',
      }}>
        🌐 English • हिंदी • ಕನ್ನಡ • தமிழ் • తెలుగు • മലയാളം
      </div>

      {/* TABS */}
      <div style={{
        display: 'flex', gap: 0,
        background: darkMode ? navy[800] : '#ffffff',
        borderBottom: `1px solid ${borderC}`,
        padding: '0 40px', flexShrink: 0,
      }}>
        {[
          { id: 'chat', icon: '💬', label: 'AI Legal Chat' },
          { id: 'analyzer', icon: '📄', label: 'Document Analyzer' },
        ].map((tab) => (
          <button
            key={tab.id}
            className="tab-btn"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '14px 24px', border: 'none', background: 'transparent',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
              color: activeTab === tab.id ? accent : textMuted,
              borderBottom: activeTab === tab.id ? `2px solid ${accent}` : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* CHAT TAB */}
      {activeTab === 'chat' && (
        <div style={{
          display: 'flex', flex: 1, overflow: 'hidden',
          maxWidth: 1100, margin: '0 auto', width: '100%',
          padding: '20px 20px 0', gap: 20,
        }}>
          {/* Sidebar */}
          <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 20 }}>
            <div style={{ background: cardBg, border: `1px solid ${borderC}`, borderRadius: 12, padding: '18px 16px' }}>
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

            <div style={{ background: cardBg, border: `1px solid ${borderC}`, borderRadius: 12, padding: '16px' }}>
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
                ⚠️ <strong>Disclaimer:</strong> This AI provides general legal information only — not legal advice. Always consult a qualified lawyer.
              </p>
            </div>

            <button onClick={() => navigate('/search')} style={{
              padding: '10px', background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
              color: '#ffffff', border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
            }}>🔍 Find a Real Lawyer</button>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{
              flex: 1, overflowY: 'auto', padding: '0 4px 16px',
              display: 'flex', flexDirection: 'column', gap: 12,
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
      )}

      {/* DOCUMENT ANALYZER TAB */}
      {activeTab === 'analyzer' && (
        <div style={{
          flex: 1, overflowY: 'auto',
          maxWidth: 800, margin: '0 auto', width: '100%',
          padding: '30px 20px 60px',
        }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 30 }}
          >
            <div style={{ fontSize: 56, marginBottom: 12 }}>📄</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: darkMode ? '#e8eeff' : navy[900], marginBottom: 8 }}>
              Legal Document <span style={{ color: accent }}>Analyzer</span>
            </h1>
            <p style={{ fontSize: 14, color: textMuted, maxWidth: 480, margin: '0 auto' }}>
              Upload any legal document and get a simple explanation in your preferred Indian language
            </p>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              background: cardBg, border: `1px solid ${borderC}`,
              borderRadius: 16, padding: '28px', marginBottom: 20,
            }}
          >
            {/* Language Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: textMuted, marginBottom: 8 }}>
                🌐 Explain results in:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: `1px solid ${borderC}`,
                  background: darkMode ? navy[700] : '#f8faff',
                  color: textMain, fontSize: 14, fontFamily: 'Inter, sans-serif',
                  outline: 'none', cursor: 'pointer',
                }}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            {/* File Upload Area */}
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="document-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="document-upload" className="upload-area" style={{
              display: 'block', cursor: 'pointer',
              border: `2px dashed ${document ? accent : borderC}`,
              borderRadius: 12, padding: '32px 20px', textAlign: 'center',
              transition: 'border-color 0.2s', marginBottom: 16,
              background: document ? (darkMode ? 'rgba(59,130,246,0.05)' : 'rgba(59,130,246,0.03)') : 'transparent',
            }}>
              {document ? (
                <div>
                  {documentPreview ? (
                    <img src={documentPreview} alt="Preview" style={{
                      maxHeight: 180, margin: '0 auto 12px', display: 'block',
                      borderRadius: 8, objectFit: 'contain',
                    }} />
                  ) : (
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
                  )}
                  <p style={{ fontWeight: 600, color: accent, fontSize: 14, marginBottom: 4 }}>{document.name}</p>
                  <p style={{ fontSize: 12, color: textMuted }}>
                    {(document.size / 1024 / 1024).toFixed(2)} MB • Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📤</div>
                  <p style={{ fontWeight: 600, fontSize: 15, color: darkMode ? '#e8eeff' : navy[900], marginBottom: 6 }}>
                    Click to upload legal document
                  </p>
                  <p style={{ fontSize: 13, color: textMuted, marginBottom: 4 }}>
                    Supports PDF and Images (JPG, PNG)
                  </p>
                  <p style={{ fontSize: 11, color: textMuted }}>Maximum file size: 10MB</p>
                </div>
              )}
            </label>

            {docError && (
              <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{docError}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              disabled={analyzing || !document}
              style={{
                width: '100%', padding: '14px',
                background: analyzing || !document ? navy[600] : `linear-gradient(135deg, ${accent}, #1d4ed8)`,
                color: analyzing || !document ? '#4a6094' : '#ffffff',
                border: 'none', borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: analyzing || !document ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: analyzing || !document ? 'none' : '0 4px 16px rgba(59,130,246,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {analyzing ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block' }}
                  >⚖️</motion.span>
                  Analyzing Document...
                </span>
              ) : '🔍 Analyze Document'}
            </motion.button>
          </motion.div>

          {/* Analysis Result */}
          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  background: cardBg, border: `1px solid ${accent}`,
                  borderRadius: 16, padding: '28px', marginBottom: 20,
                }}
              >
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: accent, marginBottom: 20 }}>
                  📋 Document Analysis Result
                </h2>
                <div style={{
                  whiteSpace: 'pre-wrap', lineHeight: 1.75, fontSize: 14,
                  color: darkMode ? '#c8ddf5' : navy[700],
                }}>
                  {analysis}
                </div>
                <div style={{
                  marginTop: 20, padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                }}>
                  <p style={{ fontSize: 12, color: '#f87171', lineHeight: 1.65 }}>
                    ⚠️ This is an AI generated analysis for general guidance only. For serious legal matters please consult a verified lawyer on Civic Circle.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/search')}
                  style={{
                    width: '100%', marginTop: 16, padding: '12px',
                    background: `linear-gradient(135deg, ${accent}, #1d4ed8)`,
                    color: '#ffffff', border: 'none', borderRadius: 10,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
                  }}
                >
                  🔍 Find a Verified Lawyer
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it works */}
          {!analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: cardBg, border: `1px solid ${borderC}`, borderRadius: 16, padding: '28px' }}
            >
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: darkMode ? '#e8eeff' : navy[900], marginBottom: 20 }}>
                How it works
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                  { icon: '📤', step: '1', title: 'Upload Document', desc: 'Upload any legal document — court notice, agreement, property deed or any legal paper' },
                  { icon: '🌐', step: '2', title: 'Choose Language', desc: 'Select your preferred language — Kannada, Hindi, Tamil or any Indian language' },
                  { icon: '🤖', step: '3', title: 'Get Explanation', desc: 'AI will explain the document in simple words you can understand easily' },
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '20px 16px', borderRadius: 12, textAlign: 'center',
                    background: darkMode ? navy[700] : '#f0f4ff',
                    border: `1px solid ${borderC}`,
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                    <div style={{
                      width: 26, height: 26, background: accent, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ffffff', fontWeight: 700, fontSize: 12,
                      margin: '0 auto 10px',
                    }}>{item.step}</div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: darkMode ? '#e8eeff' : navy[900], marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ fontSize: 12, color: textMuted, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 12 }}>Documents you can analyze:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  'Court Notices', 'Legal Agreements', 'Property Deeds',
                  'Rent Agreements', 'Police Notices', 'Consumer Complaints',
                  'Employment Contracts', 'Loan Documents', 'Government Orders'
                ].map((doc, i) => (
                  <span key={i} style={{
                    fontSize: 12, padding: '5px 12px', borderRadius: 20,
                    background: darkMode ? navy[700] : '#e8eeff',
                    color: textMuted, border: `1px solid ${borderC}`,
                  }}>{doc}</span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;