import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const StarDisplay = ({ rating }) => (
  <div style={{ display: 'flex', gap: 1 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ fontSize: 12, color: star <= Math.round(rating) ? '#4a9eff' : '#2d4a6e' }}>★</span>
    ))}
  </div>
);

const SearchLawyers = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [lawyers, setLawyers] = useState([]);
  const [lawyerRatings, setLawyerRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    city: '',
    languages_known: '',
  });

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.city) params.append('city', filters.city);
      if (filters.languages_known) params.append('languages_known', filters.languages_known);

      const res = await axios.get(`http://localhost:5000/api/lawyers?${params}`);
      const fetchedLawyers = res.data.lawyers;
      setLawyers(fetchedLawyers);

      const ratingsMap = {};
      await Promise.all(
        fetchedLawyers.map(async (lawyer) => {
          try {
            const ratingRes = await axios.get(`http://localhost:5000/api/reviews/${lawyer.id}`);
            ratingsMap[lawyer.id] = {
              avgRating: ratingRes.data.avgRating,
              totalReviews: ratingRes.data.totalReviews,
            };
          } catch {
            ratingsMap[lawyer.id] = { avgRating: 0, totalReviews: 0 };
          }
        })
      );
      setLawyerRatings(ratingsMap);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const LawyerAvatar = ({ lawyer }) => {
    const [imgError, setImgError] = useState(false);
    if (lawyer.profile_photo && !imgError) {
      return (
        <img
          src={lawyer.profile_photo}
          alt={lawyer.name}
          onError={() => setImgError(true)}
          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #1e3a5f' }}
        />
      );
    }
    const colors = ['#1a56db', '#0d5f3a', '#7c3aed', '#b45309', '#be185d'];
    const color = colors[(lawyer.name?.charCodeAt(0) || 0) % colors.length];
    return (
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 700, color: '#ffffff', flexShrink: 0,
        border: '2px solid rgba(255,255,255,0.1)',
      }}>
        {lawyer.name ? lawyer.name[0].toUpperCase() : '?'}
      </div>
    );
  };

  const d = darkMode;

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
        .search-input {
          padding: 11px 16px; border-radius: 8px; font-size: 14px;
          font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; width: 100%; box-sizing: border-box;
        }
        .search-input:focus {
          border-color: #1a56db !important;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.12);
        }
        .search-input::placeholder { opacity: 0.5; }
        .lawyer-card { transition: border-color 0.2s, transform 0.2s; }
        .lawyer-card:hover { border-color: #1a56db !important; transform: translateY(-3px); }
        .view-btn:hover { background: #1540a8 !important; }
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(26,86,219,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      {/* Particles */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} style={{
            position: 'absolute', borderRadius: i % 2 === 0 ? '50%' : '3px',
            background: '#1a56db',
            width: Math.random() * 7 + 2, height: Math.random() * 7 + 2,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.08,
          }}
            animate={{ y: [0, -30, 0], x: [0, 12, 0], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, delay: Math.random() * 3 }}
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
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{ width: 32, height: 32, background: '#1a56db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚖️</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: d ? '#ffffff' : '#0a1628' }}>Civic Circle</span>
        </motion.div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="nav-ghost" onClick={() => setDarkMode(!darkMode)} style={{
            padding: '7px 16px', borderRadius: 6, border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
            color: d ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>{d ? '☀️ Light' : '🌙 Dark'}</button>
          <button className="nav-ghost" onClick={() => navigate('/login')} style={{
            padding: '7px 18px', borderRadius: 6, border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
            color: d ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>Login</button>
          <button onClick={() => navigate('/register')} style={{
            padding: '8px 20px', borderRadius: 6, background: '#1a56db', border: 'none',
            color: '#ffffff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>Get Started</button>
        </div>
      </nav>

      {/* ── SEARCH HEADER ── */}
      <div
        className="hero-grid-bg"
        style={{
          position: 'relative', zIndex: 10,
          background: d
            ? 'linear-gradient(160deg, #0a1628 0%, #0d2145 60%, #0f2d5a 100%)'
            : 'linear-gradient(160deg, #1a3a6e 0%, #1a56db 100%)',
          padding: '52px 40px 48px',
        }}
      >
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(26,86,219,0.2)', border: '1px solid rgba(26,86,219,0.35)',
            color: '#93b8f5', fontSize: 11, fontWeight: 600, padding: '4px 14px',
            borderRadius: 20, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 16,
          }}>
            <span style={{ width: 6, height: 6, background: '#4a9eff', borderRadius: '50%', display: 'inline-block' }} />
            Verified Legal Network
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700, textAlign: 'center', color: '#ffffff',
            marginBottom: 10, letterSpacing: '-0.3px',
          }}
        >
          Find Your <span style={{ color: '#4a9eff' }}>Legal Advisor</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ textAlign: 'center', color: '#8ab0d0', fontSize: 15, marginBottom: 32 }}
        >
          Search from hundreds of verified legal advisors across India
        </motion.p>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            maxWidth: 860, margin: '0 auto',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10,
          }}
        >
          {[
            { key: 'search', placeholder: '🔍 Search by name...' },
            { key: 'specialization', placeholder: '⚖️ Specialization...' },
            { key: 'city', placeholder: '📍 City...' },
          ].map(({ key, placeholder }) => (
            <input
              key={key}
              type="text"
              placeholder={placeholder}
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              className="search-input"
              style={{
                background: d ? 'rgba(10,22,40,0.8)' : 'rgba(255,255,255,0.95)',
                border: d ? '1px solid #1e3a5f' : '1px solid rgba(255,255,255,0.4)',
                color: d ? '#c8ddf5' : '#0a1628',
              }}
              onKeyDown={(e) => e.key === 'Enter' && fetchLawyers()}
            />
          ))}
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={fetchLawyers}
            style={{
              padding: '11px 24px', background: '#1a56db', color: '#ffffff',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
          >
            🔍 Search
          </motion.button>
        </motion.div>
      </div>

      {/* ── RESULTS ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '40px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ fontSize: 52, display: 'inline-block', marginBottom: 16 }}
            >⚖️</motion.div>
            <p style={{ color: d ? '#5a7a9a' : '#7a8fa8', fontSize: 15 }}>Finding lawyers...</p>
          </div>
        ) : lawyers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 20, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628', marginBottom: 8 }}>No lawyers found</p>
            <p style={{ color: d ? '#5a7a9a' : '#7a8fa8', marginBottom: 28, fontSize: 14 }}>
              Try different filters or register as a legal advisor
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              style={{
                padding: '12px 28px', background: '#1a56db', color: '#ffffff',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              Register as Advisor
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 24, fontSize: 14, color: d ? '#5a7a9a' : '#7a8fa8' }}>
              Found{' '}
              <span style={{ color: '#1a56db', fontWeight: 700 }}>{lawyers.length}</span>
              {' '}legal advisor{lawyers.length !== 1 ? 's' : ''}
            </motion.p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {lawyers.map((lawyer, index) => {
                const rating = lawyerRatings[lawyer.id];
                return (
                  <motion.div
                    key={lawyer.id}
                    className="lawyer-card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                    style={{
                      background: d ? '#0d1f3c' : '#ffffff',
                      border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                      borderRadius: 12, padding: '22px 20px',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Card Top */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                      <motion.div whileHover={{ scale: 1.08 }}>
                        <LawyerAvatar lawyer={lawyer} />
                      </motion.div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: d ? '#e8f0fe' : '#0a1628', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lawyer.name}
                        </h3>
                        <p style={{ fontSize: 12, color: '#1a56db', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>
                          {lawyer.specialization || 'Legal Advisor'}
                        </p>
                        {lawyer.is_verified && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                            background: '#ecfdf5', color: '#059669',
                            fontSize: 10, fontWeight: 600, padding: '2px 7px',
                            borderRadius: 10, marginBottom: 4,
                          }}>✓ Verified</span>
                        )}
                        {rating && rating.totalReviews > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                            <StarDisplay rating={rating.avgRating} />
                            <span style={{ fontSize: 12, color: '#4a9eff', fontWeight: 700 }}>{rating.avgRating}</span>
                            <span style={{ fontSize: 11, color: d ? '#3a5a7a' : '#aab8c8' }}>({rating.totalReviews})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                      {lawyer.city && (
                        <p style={{ fontSize: 13, color: d ? '#5a7a9a' : '#6a7f9a', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>📍</span> {lawyer.city}
                        </p>
                      )}
                      {lawyer.experience_duration && (
                        <p style={{ fontSize: 13, color: d ? '#5a7a9a' : '#6a7f9a', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>💼</span> {lawyer.experience_duration}
                        </p>
                      )}
                      {lawyer.languages_known && (
                        <p style={{ fontSize: 13, color: d ? '#5a7a9a' : '#6a7f9a', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>🗣️</span> {lawyer.languages_known}
                        </p>
                      )}
                      {lawyer.bio && (
                        <p style={{
                          fontSize: 12, color: d ? '#3a5a7a' : '#9aabb8',
                          fontStyle: 'italic', marginTop: 4,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          "{lawyer.bio}"
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="view-btn"
                      onClick={(e) => { e.stopPropagation(); navigate(`/lawyer/${lawyer.id}`); }}
                      style={{
                        width: '100%', padding: '10px', background: '#1a56db',
                        color: '#ffffff', border: 'none', borderRadius: 8,
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
                      }}
                    >
                      View Profile →
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchLawyers;