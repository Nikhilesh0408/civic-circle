import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const BookConsultation = () => {
  const { id } = useParams(); // advisor id
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [lawyer, setLawyer] = useState(null);
  const [loadingLawyer, setLoadingLawyer] = useState(true);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'client') {
      navigate('/login');
      return;
    }
    const fetchLawyer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/lawyers/${id}`);
        setLawyer(res.data.lawyer);
      } catch (err) {
        console.error('Error fetching lawyer:', err);
      }
      setLoadingLawyer(false);
    };
    fetchLawyer();
  }, [id]);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  ];

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  // Max date = 60 days from today
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = async () => {
    setError('');
    if (!selectedDate) { setError('Please select a date.'); return; }
    if (!selectedTime) { setError('Please select a time slot.'); return; }
    if (message.trim().length < 10) { setError('Please describe your issue (minimum 10 characters).'); return; }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/bookings/create', {
        client_id: currentUser.id,
        client_name: currentUser.name,
        client_email: currentUser.email,
        advisor_id: lawyer.id,
        advisor_name: lawyer.name,
        advisor_email: lawyer.email,
        booking_date: selectedDate,
        booking_time: selectedTime,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book consultation. Please try again.');
    }
    setSubmitting(false);
  };

  const d = darkMode;

  const avatarColors = ['#1a56db', '#0d5f3a', '#7c3aed', '#b45309', '#be185d'];
  const avatarColor = lawyer
    ? avatarColors[(lawyer.name?.charCodeAt(0) || 0) % avatarColors.length]
    : '#1a56db';

  if (loadingLawyer) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: d ? '#0a1628' : '#f0f4f8' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 52 }}>⚖️</motion.div>
    </div>
  );

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
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .btn-blue:hover { background: #1540a8 !important; }
        .btn-outline:hover { background: rgba(255,255,255,0.06) !important; }
        .time-slot:hover { border-color: #1a56db !important; background: rgba(26,86,219,0.1) !important; }
        .time-slot { transition: all 0.15s; }
        .book-input { width: 100%; padding: 11px 14px; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
        .book-input:focus { border-color: #1a56db !important; box-shadow: 0 0 0 3px rgba(26,86,219,0.12); }
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
          <button className="nav-ghost" onClick={() => navigate(`/lawyer/${id}`)} style={{
            padding: '7px 18px', borderRadius: 6, border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
            color: d ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>← Back to Profile</button>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 780, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* ── SUCCESS STATE ── */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              style={{
                background: d ? 'linear-gradient(135deg, #0d1f3c, #0f2d5a)' : 'linear-gradient(135deg, #1a3a6e, #1a56db)',
                border: '1px solid #1e3a5f',
                borderRadius: 20, padding: '60px 40px', textAlign: 'center',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: 72, marginBottom: 24 }}
              >
                🎉
              </motion.div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>
                Consultation Booked!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.75, maxWidth: 440, margin: '0 auto 12px' }}>
                Your consultation with <strong style={{ color: '#fff' }}>{lawyer?.name}</strong> has been successfully booked for{' '}
                <strong style={{ color: '#4a9eff' }}>
                  {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </strong>{' '}at <strong style={{ color: '#4a9eff' }}>{selectedTime}</strong>.
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)',
                color: '#34d399', borderRadius: 10, padding: '10px 18px',
                fontSize: 13, fontWeight: 600, marginBottom: 32, marginTop: 8,
              }}>
                📧 Confirmation emails sent to both you and the advisor
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/client-dashboard')}
                  className="btn-blue"
                  style={{ padding: '11px 28px', background: '#1a56db', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}
                >
                  View My Bookings
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/search')}
                  className="btn-outline"
                  style={{ padding: '11px 28px', background: 'transparent', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}
                >
                  Find More Lawyers
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BOOKING FORM ── */}
        {!submitted && (
          <>
            {/* Page Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: 24 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(26,86,219,0.12)', border: '1px solid rgba(26,86,219,0.25)', color: '#93b8f5', fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 20, marginBottom: 14, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                <span style={{ width: 6, height: 6, background: '#4a9eff', borderRadius: '50%', display: 'inline-block' }} />
                Schedule Appointment
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: '0 0 8px' }}>
                Book a Consultation
              </h1>
              <p style={{ fontSize: 14, color: d ? '#5a7a9a' : '#6a7f9a', lineHeight: 1.6 }}>
                Select a date and time that works for you. Confirmation emails will be sent to both parties instantly.
              </p>
            </motion.div>

            {/* Lawyer Summary Card */}
            {lawyer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{
                  background: d ? '#0d1f3c' : '#ffffff',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  borderRadius: 14, padding: '20px 22px', marginBottom: 18,
                  display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
                }}
              >
                {lawyer.profile_photo && lawyer.profile_photo !== '' ? (
                  <img src={lawyer.profile_photo} alt={lawyer.name}
                    style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1a56db', flexShrink: 0 }}
                  />
                ) : (
                  <div style={{
                    width: 62, height: 62, borderRadius: '50%', background: avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 700, color: '#ffffff', flexShrink: 0,
                    border: '2px solid rgba(26,86,219,0.4)',
                  }}>
                    {lawyer.name ? lawyer.name[0].toUpperCase() : '?'}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>{lawyer.name}</h3>
                    {lawyer.is_verified && (
                      <span style={{ background: '#ecfdf5', color: '#059669', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>✓ Verified</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: '#1a56db', fontWeight: 600, margin: '0 0 6px' }}>{lawyer.specialization}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: d ? '#5a7a9a' : '#6a7f9a' }}>
                    {lawyer.city && <span>📍 {lawyer.city}</span>}
                    {lawyer.experience_duration && <span>💼 {lawyer.experience_duration}</span>}
                    {lawyer.languages_known && <span>🗣️ {lawyer.languages_known}</span>}
                  </div>
                </div>
                <div style={{
                  padding: '8px 16px', background: 'rgba(26,86,219,0.1)', border: '1px solid rgba(26,86,219,0.2)',
                  borderRadius: 8, fontSize: 12, color: '#4a9eff', fontWeight: 600, flexShrink: 0,
                }}>
                  📅 Booking Consultation
                </div>
              </motion.div>
            )}

            {/* ── DATE PICKER ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{
                background: d ? '#0d1f3c' : '#ffffff',
                border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                borderRadius: 14, padding: '26px 24px', marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Select Date</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  max={maxDateStr}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="book-input"
                  style={{
                    background: d ? '#0a1628' : '#f8fafc',
                    border: selectedDate ? '1px solid #1a56db' : d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                    color: d ? '#c8ddf5' : '#0a1628',
                    maxWidth: 240,
                    colorScheme: d ? 'dark' : 'light',
                  }}
                />
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: 13, color: '#4a9eff', fontWeight: 600 }}
                  >
                    📅 {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* ── TIME SLOTS ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{
                background: d ? '#0d1f3c' : '#ffffff',
                border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                borderRadius: 14, padding: '26px 24px', marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Select Time Slot</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className="time-slot"
                    style={{
                      padding: '10px 8px',
                      borderRadius: 8,
                      border: selectedTime === slot
                        ? '1.5px solid #1a56db'
                        : d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                      background: selectedTime === slot
                        ? 'rgba(26,86,219,0.15)'
                        : d ? '#0a1628' : '#f8fafc',
                      color: selectedTime === slot
                        ? '#4a9eff'
                        : d ? '#8ab0d0' : '#4a5a6a',
                      fontSize: 13,
                      fontWeight: selectedTime === slot ? 600 : 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── MESSAGE ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              style={{
                background: d ? '#0d1f3c' : '#ffffff',
                border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                borderRadius: 14, padding: '26px 24px', marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>Describe Your Issue</h2>
              </div>
              <p style={{ fontSize: 13, color: d ? '#5a7a9a' : '#8a9ab0', marginBottom: 14, lineHeight: 1.6 }}>
                Briefly explain your legal issue so the advisor can prepare for your consultation.
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. I have a property dispute with my neighbour regarding boundary walls. Need guidance on the legal process and my rights..."
                rows={5}
                className="book-input"
                style={{
                  background: d ? '#0a1628' : '#f8fafc',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  color: d ? '#c8ddf5' : '#0a1628',
                  resize: 'vertical',
                }}
              />
              <p style={{ fontSize: 11, color: d ? '#3a5a7a' : '#aab8c8', marginTop: 6 }}>
                {message.trim().length} characters {message.trim().length < 10 ? `(minimum 10)` : '✓'}
              </p>
            </motion.div>

            {/* ── BOOKING SUMMARY ── */}
            {(selectedDate || selectedTime) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(26,86,219,0.08)',
                  border: '1px solid rgba(26,86,219,0.2)',
                  borderRadius: 12, padding: '16px 20px', marginBottom: 16,
                  display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 13, color: '#4a9eff', fontWeight: 600 }}>📋 Booking Summary</div>
                {selectedDate && (
                  <div style={{ fontSize: 13, color: d ? '#8ab0d0' : '#4a5a6a' }}>
                    <span style={{ color: d ? '#5a7a9a' : '#8a9ab0' }}>Date: </span>
                    <strong style={{ color: d ? '#c8ddf5' : '#0a1628' }}>
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </strong>
                  </div>
                )}
                {selectedTime && (
                  <div style={{ fontSize: 13, color: d ? '#8ab0d0' : '#4a5a6a' }}>
                    <span style={{ color: d ? '#5a7a9a' : '#8a9ab0' }}>Time: </span>
                    <strong style={{ color: d ? '#c8ddf5' : '#0a1628' }}>{selectedTime}</strong>
                  </div>
                )}
                {lawyer && (
                  <div style={{ fontSize: 13, color: d ? '#8ab0d0' : '#4a5a6a' }}>
                    <span style={{ color: d ? '#5a7a9a' : '#8a9ab0' }}>Advisor: </span>
                    <strong style={{ color: d ? '#c8ddf5' : '#0a1628' }}>{lawyer.name}</strong>
                  </div>
                )}
              </motion.div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)',
                    color: '#f87171', borderRadius: 8, padding: '10px 14px',
                    fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SUBMIT ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-blue"
                style={{
                  width: '100%', padding: '14px 32px',
                  background: submitting ? '#3a5a9a' : '#1a56db',
                  color: '#ffffff', border: 'none', borderRadius: 10,
                  fontSize: 15, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {submitting ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⚖️</motion.span>
                    Booking Consultation...
                  </>
                ) : (
                  '📅 Confirm Booking'
                )}
              </motion.button>
              <p style={{ textAlign: 'center', fontSize: 12, color: d ? '#3a5a7a' : '#aab8c8', marginTop: 10 }}>
                📧 Confirmation emails will be sent to you and the advisor immediately after booking.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookConsultation;