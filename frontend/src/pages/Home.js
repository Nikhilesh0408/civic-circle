import React, { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import gsap from 'gsap';

const Home = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
    );
  }, []);

  return (
    <div
      className="min-h-screen overflow-hidden transition-all duration-500"
      style={{
        background: darkMode ? '#0a1628' : '#f0f4f8',
        color: darkMode ? '#e8f0fe' : '#0a1628',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(26,86,219,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .feature-card:hover {
          border-color: #1a56db !important;
          transform: translateY(-4px);
        }
        .feature-card {
          transition: border-color 0.2s, transform 0.2s;
        }
        .lawyer-btn:hover { background: #1540a8 !important; }
        .cta-btn-primary:hover { background: #1540a8 !important; }
        .cta-btn-outline:hover { background: rgba(255,255,255,0.08) !important; }
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .footer-link:hover { color: #4a9eff; }
      `}</style>

      {/* Subtle Floating Particles */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: darkMode ? '#1a56db' : '#93b8f5',
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.12,
            }}
            animate={{ y: [0, -25, 0], x: [0, 10, 0], opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* ── NAVBAR ── */}
      <nav
        className="relative z-10 flex justify-between items-center px-10 py-0"
        style={{
          background: darkMode ? '#0a1628' : '#ffffff',
          borderBottom: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
          height: '64px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div style={{
            width: 34, height: 34, background: '#1a56db', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
          }}>⚖️</div>
          <span className="serif" style={{ fontSize: 20, fontWeight: 600, color: darkMode ? '#ffffff' : '#0a1628', letterSpacing: '0.3px' }}>
            Civic Circle
          </span>
        </motion.div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            className="nav-ghost"
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '7px 16px', borderRadius: 6, border: darkMode ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
              color: darkMode ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
              background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              transition: 'background 0.2s',
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            className="nav-ghost"
            onClick={() => navigate('/login')}
            style={{
              padding: '7px 18px', borderRadius: 6, border: darkMode ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
              color: darkMode ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
              background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              transition: 'background 0.2s',
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '8px 20px', borderRadius: 6, background: '#1a56db', border: 'none',
              color: '#ffffff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div
        ref={heroRef}
        className="hero-grid-bg relative z-10 flex flex-col items-center justify-center text-center px-6 py-24"
        style={{
          background: darkMode
            ? 'linear-gradient(160deg, #0a1628 0%, #0d2145 55%, #0f2d5a 100%)'
            : 'linear-gradient(160deg, #1a3a6e 0%, #1a56db 60%, #2563eb 100%)',
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(26,86,219,0.18)', border: '1px solid rgba(26,86,219,0.35)',
            color: '#93b8f5', fontSize: 11, fontWeight: 600, padding: '5px 16px',
            borderRadius: 20, marginBottom: 28, letterSpacing: '0.8px', textTransform: 'uppercase',
          }}
        >
          <span style={{ width: 6, height: 6, background: '#4a9eff', borderRadius: '50%', display: 'inline-block' }} />
          Trusted Legal Network
        </motion.div>

        {/* Animated Scale Icon */}
        <motion.div
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ fontSize: 72, marginBottom: 20 }}
        >
          ⚖️
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="serif" style={{ fontSize: 'clamp(38px, 6vw, 58px)', fontWeight: 700, color: '#ffffff', lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.5px' }}>
            Legal Help,{' '}
            <span style={{ color: '#4a9eff' }}>Simplified</span>
          </h1>
          <p style={{ fontSize: 17, color: '#8ab0d0', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75, fontWeight: 400 }}>
            Connect with verified legal advisors instantly. Get expert legal guidance from the comfort of your home.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/search')}
              className="cta-btn-primary"
              style={{
                padding: '13px 32px', background: '#1a56db', color: '#ffffff',
                border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s',
              }}
            >
              🔍 Find a Lawyer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/register')}
              className="cta-btn-outline"
              style={{
                padding: '13px 32px', background: 'transparent', color: '#ffffff',
                border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 8,
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'background 0.2s',
              }}
            >
              ⚖️ Join as Advisor
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── STATS ── */}
      <div
        style={{
          background: darkMode ? '#060e1a' : '#0a1628',
          borderTop: '1px solid #1e3a5f',
          padding: '28px 40px',
          display: 'flex', justifyContent: 'center', gap: 80, flexWrap: 'wrap',
          position: 'relative', zIndex: 10,
        }}
      >
        {[
          { number: '500+', label: 'Legal Advisors' },
          { number: '10K+', label: 'Cases Solved' },
          { number: '50+', label: 'Specializations' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            style={{ textAlign: 'center' }}
          >
            <div className="serif" style={{ fontSize: 30, fontWeight: 700, color: '#4a9eff' }}>{stat.number}</div>
            <div style={{ fontSize: 12, color: '#5a7a9a', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 500 }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <div
        className="relative z-10 px-10 py-20 max-w-6xl mx-auto"
      >
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#1a56db' }}>
            Why Civic Circle
          </span>
        </div>
        <motion.h2
          className="serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: darkMode ? '#e8f0fe' : '#0a1628' }}
        >
          Everything you need for legal clarity
        </motion.h2>
        <p style={{ textAlign: 'center', color: darkMode ? '#6a8aaa' : '#5a7090', fontSize: 15, marginBottom: 48, lineHeight: 1.6 }}>
          From finding the right lawyer to resolving your case — all in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🔍', title: 'Find Experts', desc: 'Search verified legal advisors by specialization, city and language' },
            { icon: '💬', title: 'Chat Instantly', desc: 'Connect and chat with lawyers directly on the platform' },
            { icon: '🤖', title: 'AI Assistant', desc: 'Get instant answers to basic legal questions with our AI chatbot' },
            { icon: '📅', title: 'Book Consultation', desc: 'Schedule appointments with lawyers at your convenience' },
            { icon: '📝', title: 'Legal Blogs', desc: 'Read and publish informative legal articles and guides' },
            { icon: '⭐', title: 'Verified Lawyers', desc: 'All lawyers are verified and rated by real clients' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{
                background: darkMode ? '#0d1f3c' : '#ffffff',
                border: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                borderRadius: 12, padding: '28px 24px', textAlign: 'center', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 48, height: 48, background: darkMode ? '#0a1e38' : '#eff4ff',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, margin: '0 auto 16px',
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: darkMode ? '#c8ddf5' : '#0a1628', marginBottom: 8 }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 13, color: darkMode ? '#5a7a9a' : '#6a7f9a', lineHeight: 1.65 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div
        style={{
          background: darkMode ? '#060e1a' : '#ffffff',
          borderTop: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
          borderBottom: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
          padding: '70px 40px',
          position: 'relative', zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#1a56db' }}>
            Simple Process
          </span>
        </div>
        <motion.h2
          className="serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: darkMode ? '#e8f0fe' : '#0a1628' }}
        >
          How It <span style={{ color: '#1a56db' }}>Works</span>
        </motion.h2>
        <p style={{ textAlign: 'center', color: darkMode ? '#6a8aaa' : '#5a7090', fontSize: 15, marginBottom: 52, lineHeight: 1.6 }}>
          Get legal help in three simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { step: '01', icon: '📝', title: 'Create Account', desc: 'Sign up as a client or legal advisor in just 2 minutes' },
            { step: '02', icon: '🔍', title: 'Find Your Lawyer', desc: 'Search and filter lawyers by specialization, city and language' },
            { step: '03', icon: '💬', title: 'Get Legal Help', desc: 'Connect, chat and resolve your legal issues easily' },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              style={{
                position: 'relative',
                background: darkMode ? '#0d1f3c' : '#f8fafc',
                border: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                borderRadius: 12, padding: '32px 28px', textAlign: 'center', cursor: 'pointer',
              }}
            >
              <div style={{
                fontSize: 42, fontWeight: 700, color: '#1a56db', opacity: 0.12,
                position: 'absolute', top: 14, right: 18, fontFamily: 'Playfair Display, serif',
              }}>
                {item.step}
              </div>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: darkMode ? '#c8ddf5' : '#0a1628', marginBottom: 8 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 13, color: darkMode ? '#5a7a9a' : '#6a7f9a', lineHeight: 1.65 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <motion.div
        className="relative z-10 mx-8 my-12 rounded-2xl p-16 text-center"
        style={{
          background: 'linear-gradient(135deg, #0d2145, #1a3a6e)',
          border: '1px solid #1e3a5f',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="serif" style={{ fontSize: 34, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>
          Ready to get <span style={{ color: '#4a9eff' }}>Legal Help?</span>
        </h2>
        <p style={{ color: '#7a9aba', marginBottom: 32, fontSize: 16, lineHeight: 1.65 }}>
          Join thousands of people who found the right lawyer on Civic Circle
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/register')}
          className="cta-btn-primary"
          style={{
            padding: '13px 36px', background: '#1a56db', color: '#ffffff',
            border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}
        >
          Get Started Free →
        </motion.button>
      </motion.div>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 text-center py-8"
        style={{
          borderTop: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
          color: darkMode ? '#3a5a7a' : '#8a9ab0',
          fontSize: 13,
        }}
      >
        <p>© 2025 Civic Circle. Making Legal Help Accessible for Everyone! ⚖️</p>
      </footer>

      {/* ── FLOATING CHATBOT BUTTON (Gemini) ── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 50,
          width: 54, height: 54, borderRadius: '50%',
          background: '#1a56db', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(26,86,219,0.45)',
          fontSize: 24,
        }}
        title="Ask our AI Legal Assistant"
      >
        🤖
      </motion.button>

    </div>
  );
};

export default Home;