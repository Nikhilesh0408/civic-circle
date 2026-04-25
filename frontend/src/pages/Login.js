import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const Login = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Login Successful!');
      if (res.data.user.role === 'client') {
        navigate('/client-dashboard');
      } else {
        navigate('/advisor-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed!');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(160deg, #0a1628 0%, #0d2145 60%, #0a1628 100%)'
          : 'linear-gradient(160deg, #f0f4f8 0%, #e8f0fe 60%, #f0f4f8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        fontFamily: "'Inter', sans-serif",
        transition: 'background 0.5s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        .login-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: #1a56db !important;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.12);
        }
        .login-input option {
          background: #0d1f3c;
        }
        .login-btn:hover { background: #1540a8 !important; }
        .link-text:hover { text-decoration: underline; }
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(26,86,219,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      {/* Grid Background */}
      <div
        className="hero-grid-bg"
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />

      {/* Floating Particles */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: '#1a56db',
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1,
            }}
            animate={{ y: [0, -25, 0], x: [0, 10, 0], opacity: [0.06, 0.18, 0.06] }}
            transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* Top Navbar Strip */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
          height: 60,
          background: darkMode ? '#0a1628' : '#ffffff',
          borderBottom: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div style={{
            width: 30, height: 30, background: '#1a56db', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}>⚖️</div>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600,
            color: darkMode ? '#ffffff' : '#0a1628',
          }}>Civic Circle</span>
        </div>
        <button
          className="nav-ghost"
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '6px 14px', borderRadius: 6,
            border: darkMode ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
            color: darkMode ? '#a8c0d6' : '#4a6080',
            fontSize: 12, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            transition: 'background 0.2s',
          }}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 10,
          background: darkMode ? '#0d1f3c' : '#ffffff',
          border: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
          borderRadius: 16,
          padding: '44px 40px',
          width: '100%',
          maxWidth: 420,
          marginTop: 60,
          boxSizing: 'border-box',
        }}
      >
        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, background: '#1a56db', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, margin: '0 auto 16px',
          }}>⚖️</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28, fontWeight: 700,
            color: darkMode ? '#e8f0fe' : '#0a1628',
            marginBottom: 6,
          }}>Welcome Back</h2>
          <p style={{ fontSize: 14, color: darkMode ? '#5a7a9a' : '#7a8fa8', fontWeight: 400 }}>
            Sign in to your Civic Circle account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)',
            color: '#f87171', borderRadius: 8, padding: '10px 14px',
            fontSize: 13, marginBottom: 20, textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Role Selector */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: darkMode ? '#6a8aaa' : '#7a8fa8', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 6 }}>
              Login As
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="login-input"
              style={{
                background: darkMode ? '#0a1628' : '#f8fafc',
                border: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                color: darkMode ? '#c8ddf5' : '#0a1628',
              }}
            >
              <option value="client">Client</option>
              <option value="advisor">Legal Advisor</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: darkMode ? '#6a8aaa' : '#7a8fa8', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="login-input"
              style={{
                background: darkMode ? '#0a1628' : '#f8fafc',
                border: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                color: darkMode ? '#c8ddf5' : '#0a1628',
              }}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: darkMode ? '#6a8aaa' : '#7a8fa8', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="login-input"
              style={{
                background: darkMode ? '#0a1628' : '#f8fafc',
                border: darkMode ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                color: darkMode ? '#c8ddf5' : '#0a1628',
              }}
              required
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="login-btn"
            style={{
              marginTop: 6,
              padding: '13px',
              background: loading ? '#3a5a9a' : '#1a56db',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.2s',
              width: '100%',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </motion.button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 20px',
        }}>
          <div style={{ flex: 1, height: '1px', background: darkMode ? '#1e3a5f' : '#dde5ef' }} />
          <span style={{ fontSize: 12, color: darkMode ? '#3a5a7a' : '#aab8c8', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: darkMode ? '#1e3a5f' : '#dde5ef' }} />
        </div>

        {/* Footer Links */}
        <p style={{ textAlign: 'center', fontSize: 14, color: darkMode ? '#5a7a9a' : '#7a8fa8', marginBottom: 10 }}>
          Don't have an account?{' '}
          <span
            className="link-text"
            onClick={() => navigate('/register')}
            style={{ color: '#1a56db', cursor: 'pointer', fontWeight: 500 }}
          >
            Register
          </span>
        </p>
        <p style={{ textAlign: 'center', fontSize: 13 }}>
          <span
            className="link-text"
            onClick={() => navigate('/')}
            style={{ color: darkMode ? '#3a5a7a' : '#aab8c8', cursor: 'pointer' }}
          >
            ← Back to Home
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;