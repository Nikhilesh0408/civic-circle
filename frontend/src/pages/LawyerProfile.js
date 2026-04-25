import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const StarDisplay = ({ rating, size = 'sm' }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ fontSize: size === 'lg' ? 22 : 13, color: star <= rating ? '#4a9eff' : '#2d4a6e' }}>★</span>
    ))}
  </div>
);

const StarInput = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 2,
            fontSize: 28, color: star <= (hovered || value) ? '#4a9eff' : '#2d4a6e',
            transition: 'color 0.15s',
          }}
        >★</button>
      ))}
    </div>
  );
};

const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedInClient = currentUser && currentUser.role === 'client';

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/lawyers/${id}`);
        setLawyer(res.data.lawyer);
      } catch (error) {
        console.error('Error fetching lawyer:', error);
      }
      setLoading(false);
    };
    fetchLawyer();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setTotalReviews(res.data.totalReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
    setReviewsLoading(false);
  };

  const handleSubmitReview = async () => {
    setReviewError('');
    setReviewSuccess('');
    if (reviewForm.rating === 0) { setReviewError('Please select a star rating.'); return; }
    if (reviewForm.comment.trim().length < 10) { setReviewError('Comment must be at least 10 characters.'); return; }
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/reviews/${id}`, {
        client_id: currentUser.id,
        client_name: currentUser.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      setReviewSuccess('Review submitted successfully! 🎉');
      setReviewForm({ rating: 0, comment: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to submit review. Try again.');
    }
    setSubmitting(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        data: { client_id: currentUser.id }
      });
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const d = darkMode;

  const avatarColors = ['#1a56db', '#0d5f3a', '#7c3aed', '#b45309', '#be185d'];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: d ? '#0a1628' : '#f0f4f8' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 52 }}>⚖️</motion.div>
    </div>
  );

  if (!lawyer) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: d ? '#0a1628' : '#f0f4f8', color: d ? '#e8f0fe' : '#0a1628', fontFamily: 'Inter, sans-serif' }}>
      <p>Lawyer not found!</p>
    </div>
  );

  const alreadyReviewed = isLoggedInClient && reviews.some(r => r.client_id === currentUser.id);
  const avatarColor = avatarColors[(lawyer.name?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div style={{ minHeight: '100vh', background: d ? '#0a1628' : '#f0f4f8', color: d ? '#e8f0fe' : '#0a1628', fontFamily: "'Inter', sans-serif", transition: 'background 0.5s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        .profile-card { transition: border-color 0.2s; }
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .detail-tile:hover { border-color: #1a56db !important; }
        .detail-tile { transition: border-color 0.2s; }
        .review-card { transition: border-color 0.2s; }
        .review-card:hover { border-color: #1e3a5f; }
        .review-input { width: 100%; padding: 11px 14px; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; resize: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
        .review-input:focus { border-color: #1a56db !important; box-shadow: 0 0 0 3px rgba(26,86,219,0.12); }
        .btn-blue:hover { background: #1540a8 !important; }
        .btn-outline:hover { background: rgba(255,255,255,0.06) !important; }
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
            padding: '7px 16px', borderRadius: 6, border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
            color: d ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>{d ? '☀️ Light' : '🌙 Dark'}</button>
          <button className="nav-ghost" onClick={() => navigate('/search')} style={{
            padding: '7px 18px', borderRadius: 6, border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
            color: d ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>← Back to Search</button>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 860, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* ── PROFILE HEADER CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{
            background: d ? '#0d1f3c' : '#ffffff',
            border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            borderRadius: 16, padding: '32px 28px', marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
            {/* Avatar */}
            {lawyer.profile_photo && lawyer.profile_photo !== '' ? (
              <img src={lawyer.profile_photo} alt={lawyer.name}
                style={{ width: 108, height: 108, borderRadius: '50%', objectFit: 'cover', border: '3px solid #1a56db', flexShrink: 0 }}
              />
            ) : (
              <div style={{
                width: 108, height: 108, borderRadius: '50%', background: avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40, fontWeight: 700, color: '#ffffff', flexShrink: 0,
                border: '3px solid rgba(26,86,219,0.4)',
              }}>
                {lawyer.name ? lawyer.name[0].toUpperCase() : '?'}
              </div>
            )}

            {/* Info */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>
                  {lawyer.name}
                </h1>
                {lawyer.is_verified && (
                  <span style={{ background: '#ecfdf5', color: '#059669', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                    ✓ Verified
                  </span>
                )}
              </div>
              <p style={{ fontSize: 14, color: '#1a56db', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                {lawyer.specialization}
              </p>
              {totalReviews > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <StarDisplay rating={Math.round(avgRating)} />
                  <span style={{ fontWeight: 700, color: '#4a9eff', fontSize: 14 }}>{avgRating}</span>
                  <span style={{ fontSize: 13, color: d ? '#5a7a9a' : '#8a9ab0' }}>({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: d ? '#5a7a9a' : '#6a7f9a', marginBottom: 20 }}>
                {lawyer.city && <span>📍 {lawyer.city}</span>}
                {lawyer.experience_duration && <span>💼 {lawyer.experience_duration} experience</span>}
                {lawyer.languages_known && <span>🗣️ {lawyer.languages_known}</span>}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/register')}
                  className="btn-blue"
                  style={{ padding: '10px 24px', background: '#1a56db', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}>
                  Contact Now
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/register')}
                  className="btn-outline"
                  style={{ padding: '10px 24px', background: 'transparent', color: d ? '#c8ddf5' : '#0a1628', border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}>
                  Book Consultation
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── ABOUT ── */}
        {lawyer.bio && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: d ? '#0d1f3c' : '#ffffff', border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef', borderRadius: 16, padding: '28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>About</h2>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: d ? '#8ab0d0' : '#4a5a6a' }}>{lawyer.bio}</p>
          </motion.div>
        )}

        {/* ── PROFESSIONAL DETAILS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: d ? '#0d1f3c' : '#ffffff', border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef', borderRadius: 16, padding: '28px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Professional Details</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { icon: '⚖️', label: 'Specialization', value: lawyer.specialization },
              { icon: '📍', label: 'City', value: lawyer.city },
              { icon: '💼', label: 'Experience', value: lawyer.experience_duration },
              { icon: '🗣️', label: 'Languages', value: lawyer.languages_known },
              { icon: '📧', label: 'Email', value: lawyer.email },
              { icon: '📞', label: 'Phone', value: lawyer.phone },
            ].map((detail, index) => detail.value && (
              <div key={index} className="detail-tile" style={{
                padding: '14px 16px', borderRadius: 10,
                background: d ? '#0a1628' : '#f8fafc',
                border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
              }}>
                <p style={{ fontSize: 11, color: d ? '#5a7a9a' : '#8a9ab0', marginBottom: 5, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {detail.icon} {detail.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628' }}>{detail.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── BAR CERTIFICATE ── */}
        {lawyer.bar_certificate && lawyer.bar_certificate !== '' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            style={{ background: d ? '#0d1f3c' : '#ffffff', border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef', borderRadius: 16, padding: '28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Bar Council Certificate</h2>
            </div>
            <p style={{ fontSize: 13, color: d ? '#5a7a9a' : '#8a9ab0', marginBottom: 16 }}>
              This lawyer has submitted their Bar Council Certificate for verification.
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px',
              background: d ? '#0a1628' : '#f8fafc',
              border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
              borderRadius: 10,
            }}>
              <div style={{ fontSize: 36 }}>📄</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 15, color: d ? '#c8ddf5' : '#0a1628', marginBottom: 3 }}>Bar Council Certificate</p>
                <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#8a9ab0' }}>Verified legal document submitted by the lawyer</p>
              </div>
              <a href={lawyer.bar_certificate} target="_blank" rel="noopener noreferrer"
                style={{ padding: '8px 18px', background: '#1a56db', color: '#ffffff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                View
              </a>
            </div>
          </motion.div>
        )}

        {/* ── REVIEWS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: d ? '#0d1f3c' : '#ffffff', border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef', borderRadius: 16, padding: '28px', marginBottom: 20 }}>

          {/* Reviews Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Client Reviews</h2>
              </div>
              {totalReviews > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 11 }}>
                  <StarDisplay rating={Math.round(avgRating)} />
                  <span style={{ fontWeight: 700, color: '#4a9eff', fontSize: 14 }}>{avgRating}</span>
                  <span style={{ fontSize: 13, color: d ? '#5a7a9a' : '#8a9ab0' }}>({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
                </div>
              )}
            </div>
            <div>
              {isLoggedInClient && !alreadyReviewed && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  style={{
                    padding: '9px 18px', background: showReviewForm ? 'transparent' : '#1a56db',
                    color: showReviewForm ? (d ? '#a8c0d6' : '#4a6080') : '#ffffff',
                    border: showReviewForm ? (d ? '1px solid #2d4a6e' : '1px solid #c5d5e8') : 'none',
                    borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                  }}>
                  {showReviewForm ? 'Cancel' : '✍️ Write a Review'}
                </motion.button>
              )}
              {isLoggedInClient && alreadyReviewed && (
                <span style={{ fontSize: 12, padding: '8px 14px', borderRadius: 8, background: d ? '#0a1628' : '#f0f4f8', color: '#059669', fontWeight: 600 }}>
                  ✅ You reviewed this lawyer
                </span>
              )}
              {!currentUser && (
                <button onClick={() => navigate('/login')} style={{
                  padding: '9px 18px', background: 'transparent',
                  border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
                  color: d ? '#a8c0d6' : '#4a6080', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>Login to Review</button>
              )}
              {currentUser && currentUser.role === 'advisor' && (
                <span style={{ fontSize: 12, padding: '8px 14px', borderRadius: 8, background: d ? '#0a1628' : '#f0f4f8', color: d ? '#5a7a9a' : '#8a9ab0' }}>
                  Only clients can leave reviews
                </span>
              )}
            </div>
          </div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                style={{ overflow: 'hidden', marginBottom: 24 }}
              >
                <div style={{
                  padding: '22px', borderRadius: 12,
                  background: d ? '#0a1628' : '#f8fafc',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628', marginBottom: 16 }}>Your Review</h3>
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: d ? '#5a7a9a' : '#8a9ab0', marginBottom: 8 }}>Rating *</p>
                    <StarInput value={reviewForm.rating} onChange={(val) => setReviewForm({ ...reviewForm, rating: val })} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: d ? '#5a7a9a' : '#8a9ab0', marginBottom: 8 }}>Comment *</p>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience with this lawyer..."
                      rows={4}
                      className="review-input"
                      style={{ background: d ? '#0d1f3c' : '#ffffff', border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef', color: d ? '#c8ddf5' : '#0a1628' }}
                    />
                  </div>
                  {reviewError && (
                    <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171', borderRadius: 8, padding: '8px 12px', fontSize: 12, marginBottom: 12 }}>
                      ⚠️ {reviewError}
                    </div>
                  )}
                  {reviewSuccess && (
                    <div style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)', color: '#34d399', borderRadius: 8, padding: '8px 12px', fontSize: 12, marginBottom: 12 }}>
                      {reviewSuccess}
                    </div>
                  )}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleSubmitReview} disabled={submitting}
                    className="btn-blue"
                    style={{ padding: '10px 24px', background: submitting ? '#3a5a9a' : '#1a56db', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          {reviewsLoading ? (
            <p style={{ textAlign: 'center', padding: '24px 0', color: d ? '#5a7a9a' : '#8a9ab0', fontSize: 14 }}>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
              <p style={{ fontWeight: 600, color: d ? '#5a7a9a' : '#8a9ab0', marginBottom: 4 }}>No reviews yet</p>
              <p style={{ fontSize: 13, color: d ? '#3a5a7a' : '#aab8c8' }}>Be the first to review this lawyer!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map((review, index) => (
                <motion.div key={review.id} className="review-card"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  style={{ padding: '18px', borderRadius: 10, background: d ? '#0a1628' : '#f8fafc', border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%', background: '#1a56db',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 700, color: '#ffffff', flexShrink: 0,
                      }}>
                        {review.client_name ? review.client_name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14, color: d ? '#c8ddf5' : '#0a1628', marginBottom: 3 }}>{review.client_name}</p>
                        <StarDisplay rating={review.rating} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <p style={{ fontSize: 11, color: d ? '#3a5a7a' : '#aab8c8' }}>
                        {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {isLoggedInClient && currentUser.id === review.client_id && (
                        <button onClick={() => handleDeleteReview(review.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#f87171', padding: 0 }}>
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: d ? '#8ab0d0' : '#4a5a6a' }}>{review.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'linear-gradient(135deg, #0d2145, #1a3a6e)', border: '1px solid #1e3a5f', borderRadius: 16, padding: '36px 28px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
            Need Legal Help from <span style={{ color: '#4a9eff' }}>{lawyer.name}?</span>
          </h2>
          <p style={{ color: '#7a9aba', marginBottom: 24, fontSize: 14, lineHeight: 1.65 }}>
            Register or login to contact this lawyer directly!
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              className="btn-blue"
              style={{ padding: '11px 28px', background: '#1a56db', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}>
              Get Started Free
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="btn-outline"
              style={{ padding: '11px 28px', background: 'transparent', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}>
              Login
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LawyerProfile;