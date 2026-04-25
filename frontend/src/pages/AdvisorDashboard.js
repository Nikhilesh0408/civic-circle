import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const AdvisorDashboard = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, totalReviews: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/login'); return; }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'advisor') { navigate('/login'); return; }
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const profileRes = await axios.get(`http://localhost:5000/api/lawyers/${parsedUser.id}`);
        setProfileData(profileRes.data.lawyer);
        const reviewRes = await axios.get(`http://localhost:5000/api/reviews/${parsedUser.id}`);
        setReviewStats({ avgRating: reviewRes.data.avgRating, totalReviews: reviewRes.data.totalReviews });
      } catch (error) {
        console.error('Error fetching advisor data:', error);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const AdvisorAvatar = () => {
    const [imgError, setImgError] = useState(false);
    const photo = profileData?.profile_photo;
    const avatarColors = ['#1a56db', '#0d5f3a', '#7c3aed', '#b45309', '#be185d'];
    const color = avatarColors[(user?.name?.charCodeAt(0) || 0) % avatarColors.length];
    if (photo && !imgError) {
      return (
        <img src={photo} alt={user?.name}
          onError={() => setImgError(true)}
          style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid rgba(255,255,255,0.2)' }}
        />
      );
    }
    return (
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 700, color: '#ffffff', flexShrink: 0,
        border: '3px solid rgba(255,255,255,0.15)',
      }}>
        {user?.name ? user.name[0].toUpperCase() : '?'}
      </div>
    );
  };

  if (!user) return null;

  const d = darkMode;

  const completionItems = [
    { label: 'Basic Information', done: true },
    { label: 'Profile Photo', done: !!profileData?.profile_photo },
    { label: 'Bar Council Certificate', done: !!profileData?.bar_certificate },
    { label: 'Specialization & City', done: !!(profileData?.specialization && profileData?.city) },
    { label: 'Get Verified Badge', done: profileData?.is_verified || false },
  ];
  const completionPct = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100);

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
        .progress-bar-fill { transition: width 0.8s ease; }
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
            <AdvisorAvatar />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Welcome, {user.name}! 👋
                </h1>
                <span style={{
                  background: 'rgba(255,255,255,0.15)', color: '#ffffff',
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 20, letterSpacing: '0.5px',
                }}>Legal Advisor</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 12 }}>{user.email}</p>

              {/* Inline rating if available */}
              {reviewStats.totalReviews > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ fontSize: 13, color: s <= Math.round(reviewStats.avgRating) ? '#4a9eff' : 'rgba(255,255,255,0.2)' }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 13, color: '#93b8f5', fontWeight: 600 }}>{reviewStats.avgRating}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>({reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''})</span>
                </div>
              )}
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
              { icon: '👤', title: 'View My Profile', desc: 'See how clients view your profile', action: () => navigate(`/lawyer/${user.id}`) },
              { icon: '📝', title: 'Write a Blog', desc: 'Share your legal knowledge', action: () => navigate('/blogs/create') },
              { icon: '📊', title: 'View Analytics', desc: 'Track your profile performance', action: () => {} },
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

        {/* ── STATS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Your Stats</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {[
              { icon: '👁️', label: 'Profile Views', value: '0' },
              { icon: '📅', label: 'Consultations', value: '0' },
              { icon: '💬', label: 'Messages', value: '0' },
              { icon: '⭐', label: 'Reviews', value: String(reviewStats.totalReviews) },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.07 }}
                style={{
                  background: d ? '#0d1f3c' : '#ffffff',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  borderRadius: 12, padding: '22px 16px', textAlign: 'center',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{stat.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#1a56db', marginBottom: 4 }}>{stat.value}</div>
                <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#7a8fa8', fontWeight: 500 }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Avg Rating Bar */}
          {reviewStats.totalReviews > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{
                marginTop: 14, padding: '18px 20px', borderRadius: 12,
                background: d ? '#0d1f3c' : '#ffffff',
                border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              <div style={{ fontSize: 32 }}>⭐</div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#1a56db', marginBottom: 2 }}>
                  {reviewStats.avgRating} <span style={{ fontSize: 14, color: d ? '#5a7a9a' : '#7a8fa8', fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>/ 5</span>
                </p>
                <p style={{ fontSize: 13, color: d ? '#5a7a9a' : '#7a8fa8' }}>
                  Average rating from {reviewStats.totalReviews} client review{reviewStats.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ── PROFILE COMPLETION ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            background: d ? '#0d1f3c' : '#ffffff',
            border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            borderRadius: 16, padding: '28px', marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Profile Completion</h2>
            </div>
            <span style={{
              fontSize: 13, fontWeight: 700, color: completionPct === 100 ? '#34d399' : '#1a56db',
              background: completionPct === 100 ? 'rgba(52,211,153,0.1)' : 'rgba(26,86,219,0.1)',
              border: `1px solid ${completionPct === 100 ? 'rgba(52,211,153,0.3)' : 'rgba(26,86,219,0.3)'}`,
              padding: '4px 12px', borderRadius: 20,
            }}>{completionPct}% Complete</span>
          </div>

          {/* Progress Bar */}
          <div style={{ height: 6, background: d ? '#1e3a5f' : '#e8f0fe', borderRadius: 3, marginBottom: 20, overflow: 'hidden' }}>
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: completionPct === 100 ? '#34d399' : '#1a56db', borderRadius: 3 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {completionItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: item.done ? 'rgba(52,211,153,0.15)' : (d ? '#0a1628' : '#f0f4f8'),
                  border: `1.5px solid ${item.done ? '#34d399' : (d ? '#1e3a5f' : '#dde5ef')}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12,
                }}>
                  {item.done ? '✓' : ''}
                </div>
                <p style={{
                  fontSize: 14, fontWeight: item.done ? 500 : 400,
                  color: item.done ? (d ? '#c8ddf5' : '#0a1628') : (d ? '#3a5a7a' : '#aab8c8'),
                }}>{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── TIPS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          style={{
            background: d ? '#0d1f3c' : '#ffffff',
            border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            borderRadius: 16, padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Tips to Get More Clients</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {[
              { icon: '📸', tip: 'Add a professional profile photo to increase trust.' },
              { icon: '✍️', tip: 'Write detailed blogs to showcase your expertise.' },
              { icon: '🌟', tip: 'Ask satisfied clients to leave reviews on your profile.' },
              { icon: '📍', tip: 'Keep your city and specialization updated for better search visibility.' },
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

export default AdvisorDashboard;