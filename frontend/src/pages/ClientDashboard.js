import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/login'); return; }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'client') { navigate('/login'); return; }
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  if (!user) return null;

  const d = darkMode;
  const avatarColors = ['#1a56db', '#0d5f3a', '#7c3aed', '#b45309', '#be185d'];
  const avatarColor = avatarColors[(user.name?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div style={{
      minHeight: '100vh',
      background: d ? '#0a1628' : '#f0f4f8',
      color: d ? '#e8f0fe' : '#0a1628',
      fontFamily: "'Inter', sans-serif",
      transition: 'background 0.5s',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        .action-card { transition: border-color 0.2s, transform 0.2s; }
        .action-card:hover { border-color: #1a56db !important; transform: translateY(-3px); }
        .stat-card { transition: border-color 0.2s; }
        .stat-card:hover { border-color: #1a56db !important; }
        .tip-card { transition: border-color 0.2s; }
        .tip-card:hover { border-color: #1a56db !important; }
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .logout-btn:hover { background: rgba(239,68,68,0.1) !important; }
        .hero-grid-bg {
          background-image: linear-gradient(rgba(26,86,219,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,86,219,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      {/* Particles */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(15)].map((_, i) => (
          <motion.div key={i} style={{
            position: 'absolute', borderRadius: '50%', background: '#1a56db',
            width: Math.random() * 6 + 2, height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.08,
          }}
            animate={{ y: [0, -20, 0], opacity: [0.04, 0.14, 0.04] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 40px', height: 64,
        background: d ? '#0a1628' : '#ffffff',
        borderBottom: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 32, height: 32, background: '#1a56db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚖️</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: d ? '#ffffff' : '#0a1628' }}>Civic Circle</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="nav-ghost" onClick={() => setDarkMode(!darkMode)} style={{
            padding: '7px 16px', borderRadius: 6,
            border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
            color: d ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>{d ? '☀️ Light' : '🌙 Dark'}</button>
          <button className="logout-btn" onClick={handleLogout} style={{
            padding: '7px 18px', borderRadius: 6,
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#f87171', fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1000, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* ── WELCOME CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{
            background: d
              ? 'linear-gradient(135deg, #0d1f3c, #0f2d5a)'
              : 'linear-gradient(135deg, #1a3a6e, #1a56db)',
            border: d ? '1px solid #1e3a5f' : 'none',
            borderRadius: 16, padding: '32px 28px', marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: '#ffffff', flexShrink: 0,
              border: '3px solid rgba(255,255,255,0.15)',
            }}>
              {user.name ? user.name[0].toUpperCase() : '?'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Welcome, {user.name}! 👋
                </h1>
                <span style={{
                  background: 'rgba(255,255,255,0.15)', color: '#ffffff',
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 20, letterSpacing: '0.5px',
                }}>Client</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* ── QUICK ACTIONS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Quick Actions</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { icon: '🔍', title: 'Find a Lawyer', desc: 'Search verified legal advisors', action: () => navigate('/search') },
              { icon: '🤖', title: 'AI Legal Assistant', desc: 'Get instant legal guidance', action: () => navigate('/ai-chat') },
              { icon: '📝', title: 'Legal Blogs', desc: 'Read legal articles and guides', action: () => navigate('/blogs') },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="action-card"
                whileTap={{ scale: 0.97 }}
                onClick={item.action}
                style={{
                  background: d ? '#0d1f3c' : '#ffffff',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  borderRadius: 12, padding: '22px 20px', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 46, height: 46, background: d ? '#0a1628' : '#eff4ff',
                  borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 14,
                }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628', marginBottom: 5 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: d ? '#5a7a9a' : '#6a7f9a', lineHeight: 1.5 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── ACTIVITY STATS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Your Activity</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { icon: '📅', label: 'Consultations Booked', value: '0' },
              { icon: '💬', label: 'Messages Sent', value: '0' },
              { icon: '⭐', label: 'Reviews Given', value: '0' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.08 }}
                style={{
                  background: d ? '#0d1f3c' : '#ffffff',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  borderRadius: 12, padding: '24px 20px', textAlign: 'center',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 10 }}>{stat.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#1a56db', marginBottom: 4 }}>{stat.value}</div>
                <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#7a8fa8', fontWeight: 500 }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── LEGAL TIPS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            background: d ? '#0d1f3c' : '#ffffff',
            border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            borderRadius: 16, padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Legal Tips for You</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {[
              { icon: '💡', tip: 'Always consult a lawyer before signing any legal document or contract.' },
              { icon: '🔒', tip: 'Keep copies of all important legal documents in a safe place.' },
              { icon: '⏰', tip: 'Be aware of legal deadlines — missing them can affect your case.' },
              { icon: '📞', tip: 'When in doubt, reach out to a verified legal advisor on Civic Circle.' },
            ].map((item, index) => (
              <div key={index} className="tip-card" style={{
                display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 10,
                background: d ? '#0a1628' : '#f8fafc',
                border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                transition: 'border-color 0.2s',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: 13, color: d ? '#8ab0d0' : '#4a5a6a', lineHeight: 1.65 }}>{item.tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ClientDashboard;