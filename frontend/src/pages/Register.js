import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const Register = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    city: '',
    bio: '',
    experience_duration: '',
    languages_known: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [barCertificate, setBarCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = role === 'client'
        ? 'http://localhost:5000/api/auth/register/client'
        : 'http://localhost:5000/api/auth/register/advisor';

      let res;
      if (role === 'advisor') {
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (profilePhoto) data.append('profile_photo', profilePhoto);
        if (barCertificate) data.append('bar_certificate', barCertificate);
        res = await axios.post(url, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post(url, formData);
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Registration Successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    }
    setLoading(false);
  };

  const d = darkMode;

  return (
    <div style={{
      minHeight: '100vh',
      background: d
        ? 'linear-gradient(160deg, #0a1628 0%, #0d2145 60%, #0a1628 100%)'
        : 'linear-gradient(160deg, #f0f4f8 0%, #e8f0fe 60%, #f0f4f8 100%)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '80px 16px 48px',
      fontFamily: "'Inter', sans-serif",
      transition: 'background 0.5s',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        .reg-input {
          width: 100%; padding: 11px 14px; border-radius: 8px;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .reg-input:focus {
          border-color: #1a56db !important;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.12);
        }
        .reg-input::placeholder { opacity: 0.5; }
        .role-btn-active { background: #1a56db !important; color: #fff !important; border-color: #1a56db !important; }
        .reg-submit:hover:not(:disabled) { background: #1540a8 !important; }
        .link-text:hover { text-decoration: underline; }
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .upload-zone { transition: border-color 0.2s; }
        .upload-zone:hover { border-color: #1a56db !important; }
        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(26,86,219,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      {/* Grid BG */}
      <div className="hero-grid-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Particles */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(15)].map((_, i) => (
          <motion.div key={i} style={{
            position: 'absolute', borderRadius: '50%', background: '#1a56db',
            width: Math.random() * 6 + 2, height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.1,
          }}
            animate={{ y: [0, -25, 0], x: [0, 10, 0], opacity: [0.06, 0.18, 0.06] }}
            transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* Navbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20, height: 60,
        background: d ? '#0a1628' : '#ffffff',
        borderBottom: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 30, height: 30, background: '#1a56db', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⚖️</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: d ? '#ffffff' : '#0a1628' }}>Civic Circle</span>
        </div>
        <button className="nav-ghost" onClick={() => setDarkMode(!darkMode)} style={{
          padding: '6px 14px', borderRadius: 6,
          border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
          color: d ? '#a8c0d6' : '#4a6080', fontSize: 12, fontWeight: 500,
          background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
        }}>
          {d ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 10,
          background: d ? '#0d1f3c' : '#ffffff',
          border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
          borderRadius: 16, padding: '40px 36px',
          width: '100%', maxWidth: 480, boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, background: '#1a56db', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, margin: '0 auto 14px',
          }}>⚖️</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', marginBottom: 6 }}>
            Create Account
          </h2>
          <p style={{ fontSize: 14, color: d ? '#5a7a9a' : '#7a8fa8' }}>
            Join Civic Circle — legal help, simplified
          </p>
        </div>

        {/* Role Toggle */}
        <div style={{
          display: 'flex', gap: 0, marginBottom: 24,
          background: d ? '#0a1628' : '#f0f4f8',
          border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
          borderRadius: 10, padding: 4,
        }}>
          {[{ val: 'client', label: '👤 Client' }, { val: 'advisor', label: '⚖️ Legal Advisor' }].map(({ val, label }) => (
            <button key={val} onClick={() => setRole(val)} style={{
              flex: 1, padding: '9px 0', borderRadius: 7, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              background: role === val ? '#1a56db' : 'transparent',
              color: role === val ? '#ffffff' : (d ? '#5a7a9a' : '#7a8fa8'),
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)',
            color: '#f87171', borderRadius: 8, padding: '10px 14px',
            fontSize: 13, marginBottom: 18, textAlign: 'center',
          }}>{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Shared Fields */}
          {[
            { key: 'name', placeholder: 'Full Name', type: 'text', required: true },
            { key: 'email', placeholder: 'Email Address', type: 'email', required: true },
            { key: 'password', placeholder: 'Password', type: 'password', required: true },
            { key: 'phone', placeholder: 'Phone Number', type: 'text', required: false },
          ].map(({ key, placeholder, type, required }) => (
            <input
              key={key}
              type={type}
              placeholder={placeholder}
              value={formData[key]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="reg-input"
              required={required}
              style={{
                background: d ? '#0a1628' : '#f8fafc',
                border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                color: d ? '#c8ddf5' : '#0a1628',
              }}
            />
          ))}

          {/* Advisor-only Fields */}
          <AnimatePresence>
            {role === 'advisor' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}
              >
                {/* Section Label */}
                <div style={{
                  borderTop: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  paddingTop: 16, marginTop: 4,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 16, background: '#1a56db', borderRadius: 2 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#1a56db' }}>
                      Professional Details
                    </span>
                  </div>
                </div>

                {[
                  { key: 'specialization', placeholder: 'Specialization (e.g. Criminal Law)', required: true },
                  { key: 'city', placeholder: 'City (e.g. Mumbai, Delhi)', required: true },
                  { key: 'experience_duration', placeholder: 'Experience Duration (e.g. 5 years)', required: false },
                  { key: 'languages_known', placeholder: 'Languages Known (e.g. English, Hindi)', required: false },
                ].map(({ key, placeholder, required }) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="reg-input"
                    required={required}
                    style={{
                      background: d ? '#0a1628' : '#f8fafc',
                      border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                      color: d ? '#c8ddf5' : '#0a1628',
                    }}
                  />
                ))}

                <textarea
                  placeholder="Bio — Tell clients about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="reg-input"
                  style={{
                    background: d ? '#0a1628' : '#f8fafc',
                    border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                    color: d ? '#c8ddf5' : '#0a1628',
                    resize: 'none',
                  }}
                />

                {/* Upload Section Label */}
                <div style={{
                  borderTop: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  paddingTop: 16, marginTop: 4,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 16, background: '#1a56db', borderRadius: 2 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#1a56db' }}>
                      Upload Documents
                    </span>
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="upload-zone" style={{
                  border: d ? '1.5px dashed #1e3a5f' : '1.5px dashed #c5d5e8',
                  borderRadius: 10, padding: '16px 14px', textAlign: 'center',
                  background: d ? '#0a1628' : '#f8fafc',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>📸</div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: d ? '#6a8aaa' : '#7a8fa8', marginBottom: 10 }}>
                    Profile Photo
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                    style={{ width: '100%', fontSize: 12, color: d ? '#6a8aaa' : '#7a8fa8' }}
                  />
                  {profilePhoto && (
                    <p style={{ color: '#34d399', fontSize: 11, marginTop: 8, fontWeight: 500 }}>
                      ✅ {profilePhoto.name}
                    </p>
                  )}
                </div>

                {/* Bar Certificate */}
                <div className="upload-zone" style={{
                  border: d ? '1.5px dashed #1e3a5f' : '1.5px dashed #c5d5e8',
                  borderRadius: 10, padding: '16px 14px', textAlign: 'center',
                  background: d ? '#0a1628' : '#f8fafc',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>📄</div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: d ? '#6a8aaa' : '#7a8fa8', marginBottom: 10 }}>
                    Bar Council Certificate
                  </p>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setBarCertificate(e.target.files[0])}
                    style={{ width: '100%', fontSize: 12, color: d ? '#6a8aaa' : '#7a8fa8' }}
                  />
                  {barCertificate && (
                    <p style={{ color: '#34d399', fontSize: 11, marginTop: 8, fontWeight: 500 }}>
                      ✅ {barCertificate.name}
                    </p>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="reg-submit"
            style={{
              marginTop: 8,
              padding: '13px',
              background: loading ? '#3a5a9a' : '#1a56db',
              color: '#ffffff', border: 'none', borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'background 0.2s', width: '100%',
            }}
          >
            {loading ? 'Creating account...' : `Register as ${role === 'client' ? 'Client' : 'Legal Advisor'} →`}
          </motion.button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 18px' }}>
          <div style={{ flex: 1, height: '1px', background: d ? '#1e3a5f' : '#dde5ef' }} />
          <span style={{ fontSize: 12, color: d ? '#3a5a7a' : '#aab8c8', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: d ? '#1e3a5f' : '#dde5ef' }} />
        </div>

        {/* Footer Links */}
        <p style={{ textAlign: 'center', fontSize: 14, color: d ? '#5a7a9a' : '#7a8fa8', marginBottom: 10 }}>
          Already have an account?{' '}
          <span className="link-text" onClick={() => navigate('/login')}
            style={{ color: '#1a56db', cursor: 'pointer', fontWeight: 500 }}>
            Login
          </span>
        </p>
        <p style={{ textAlign: 'center', fontSize: 13 }}>
          <span className="link-text" onClick={() => navigate('/')}
            style={{ color: d ? '#3a5a7a' : '#aab8c8', cursor: 'pointer' }}>
            ← Back to Home
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;