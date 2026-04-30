import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('lawyers');
  const [lawyers, setLawyers] = useState([]);
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { navigate('/admin'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lawyersRes, clientsRes, bookingsRes, blogsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/lawyers'),
        axios.get('http://localhost:5000/api/admin/clients'),
        axios.get('http://localhost:5000/api/admin/bookings'),
        axios.get('http://localhost:5000/api/admin/blogs'),
      ]);
      setLawyers(lawyersRes.data.lawyers);
      setClients(clientsRes.data.clients);
      setBookings(bookingsRes.data.bookings);
      setBlogs(blogsRes.data.blogs);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
    setLoading(false);
  };

  const handleVerifyLawyer = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/verify-lawyer/${id}`, {
        is_verified: !currentStatus,
      });
      setLawyers(lawyers.map(l => l.id === id ? { ...l, is_verified: !currentStatus } : l));
    } catch (error) {
      console.error('Error verifying lawyer:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/blog/${id}`);
        setBlogs(blogs.filter(b => b.id !== id));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleDeleteUser = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/user/${id}/${type}`);
        if (type === 'client') {
          setClients(clients.filter(c => c.id !== id));
        } else {
          setLawyers(lawyers.filter(l => l.id !== id));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      navigate('/admin');
    }
  };

  const d = darkMode;

  const tabs = [
    { id: 'lawyers', label: 'Legal Advisors', icon: '⚖️', count: lawyers.length },
    { id: 'clients', label: 'Clients', icon: '👥', count: clients.length },
    { id: 'bookings', label: 'Bookings', icon: '📅', count: bookings.length },
    { id: 'blogs', label: 'Blogs', icon: '📝', count: blogs.length },
  ];

  const statusConfig = {
    pending:   { label: 'Pending',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)' },
    confirmed: { label: 'Confirmed', color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)' },
    rejected:  { label: 'Rejected',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)'  },
  };

  const cardStyle = {
    background: d ? '#0d1f3c' : '#ffffff',
    border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
    borderRadius: 14,
    padding: '20px 24px',
  };

  const emptyStyle = {
    ...cardStyle,
    textAlign: 'center',
    padding: '48px 24px',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: d ? '#0a1628' : '#f0f4f8',
        color: d ? '#e8f0fe' : '#0a1628',
        fontFamily: "'Inter', sans-serif",
        transition: 'background 0.5s',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .logout-btn:hover { background: rgba(239,68,68,0.1) !important; }
        .tab-btn:hover { border-color: #1a56db !important; color: #4a9eff !important; }
        .admin-card { transition: border-color 0.2s, transform 0.2s; }
        .admin-card:hover { border-color: #1a56db !important; transform: translateY(-2px); }
        .btn-red:hover { background: #dc2626 !important; }
        .btn-green:hover { background: #059669 !important; }
      `}</style>

      {/* Particles */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute', borderRadius: '50%', background: '#1a56db',
              width: Math.random() * 6 + 2, height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.08,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.04, 0.14, 0.04] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* NAVBAR */}
      <nav
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 40px', height: 64,
          background: d ? '#0a1628' : '#ffffff',
          borderBottom: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#1a56db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            🛡️
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: d ? '#ffffff' : '#0a1628' }}>
              Admin Panel
            </div>
            <div style={{ fontSize: 11, color: d ? '#5a7a9a' : '#8a9ab0' }}>
              Civic Circle Administration
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            className="nav-ghost"
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '7px 16px', borderRadius: 6,
              border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
              color: d ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
              background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
            }}
          >
            {d ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            className="logout-btn"
            onClick={handleLogout}
            style={{
              padding: '7px 18px', borderRadius: 6,
              border: '1px solid rgba(239,68,68,0.4)',
              color: '#f87171', fontSize: 13, fontWeight: 500,
              background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: d ? '#0d1f3c' : '#ffffff',
                border: activeTab === tab.id ? '1px solid #1a56db' : d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                borderRadius: 12, padding: '22px 16px', textAlign: 'center', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{tab.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#1a56db', marginBottom: 4 }}>
                {tab.count}
              </div>
              <div style={{ fontSize: 12, color: d ? '#5a7a9a' : '#7a8fa8', fontWeight: 500 }}>
                {tab.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="tab-btn"
              style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                background: activeTab === tab.id ? '#1a56db' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : d ? '#8ab0d0' : '#4a5a6a',
                border: activeTab === tab.id
                  ? '1px solid #1a56db'
                  : d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
              }}
            >
              {tab.icon} {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ fontSize: 52, display: 'inline-block' }}
            >
              ⚖️
            </motion.div>
            <p style={{ color: d ? '#5a7a9a' : '#8a9ab0', marginTop: 16, fontSize: 14 }}>Loading data...</p>
          </div>
        ) : (
          <div>

            {/* LEGAL ADVISORS TAB */}
            {activeTab === 'lawyers' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>
                    Legal Advisors Management
                  </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {lawyers.length === 0 ? (
                    <div style={emptyStyle}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>⚖️</div>
                      <p style={{ color: d ? '#5a7a9a' : '#8a9ab0', fontSize: 14 }}>No legal advisors registered yet.</p>
                    </div>
                  ) : (
                    lawyers.map((lawyer) => (
                      <motion.div
                        key={lawyer.id}
                        className="admin-card"
                        style={cardStyle}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18 }}>
                          {lawyer.profile_photo ? (
                            <img
                              src={lawyer.profile_photo}
                              alt={lawyer.name}
                              style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1a56db', flexShrink: 0 }}
                            />
                          ) : (
                            <div style={{
                              width: 60, height: 60, borderRadius: '50%', background: '#1a56db',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 22, fontWeight: 700, color: '#ffffff', flexShrink: 0,
                            }}>
                              {lawyer.name ? lawyer.name[0].toUpperCase() : '?'}
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 180 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                              <span style={{ fontSize: 16, fontWeight: 700, color: d ? '#c8ddf5' : '#0a1628' }}>{lawyer.name}</span>
                              {lawyer.is_verified && (
                                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: 13, color: '#1a56db', fontWeight: 600, margin: '0 0 2px' }}>{lawyer.specialization}</p>
                            <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#6a7f9a', margin: '0 0 2px' }}>{lawyer.email}</p>
                            <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#6a7f9a', margin: 0 }}>📍 {lawyer.city || 'N/A'}</p>
                          </div>
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                            {lawyer.bar_certificate && (
                              <a
                                href={lawyer.bar_certificate}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                  border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
                                  color: d ? '#a8c0d6' : '#4a6080', textDecoration: 'none',
                                  fontFamily: 'Inter, sans-serif',
                                }}
                              >
                                📄 Certificate
                              </a>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleVerifyLawyer(lawyer.id, lawyer.is_verified)}
                              className={lawyer.is_verified ? 'btn-red' : 'btn-green'}
                              style={{
                                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                background: lawyer.is_verified ? '#10b981' : '#3a5a7a',
                                color: '#ffffff', transition: 'background 0.2s',
                              }}
                            >
                              {lawyer.is_verified ? '✅ Verified' : '⭕ Verify'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleDeleteUser(lawyer.id, 'advisor')}
                              className="btn-red"
                              style={{
                                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                background: '#ef4444', color: '#ffffff', transition: 'background 0.2s',
                              }}
                            >
                              🗑️ Delete
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* CLIENTS TAB */}
            {activeTab === 'clients' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>
                    Clients Management
                  </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {clients.length === 0 ? (
                    <div style={emptyStyle}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                      <p style={{ color: d ? '#5a7a9a' : '#8a9ab0', fontSize: 14 }}>No clients registered yet.</p>
                    </div>
                  ) : (
                    clients.map((client) => (
                      <motion.div
                        key={client.id}
                        className="admin-card"
                        style={{ ...cardStyle, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}
                      >
                        <div style={{
                          width: 46, height: 46, borderRadius: '50%', background: '#1a56db',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, fontWeight: 700, color: '#ffffff', flexShrink: 0,
                        }}>
                          {client.name ? client.name[0].toUpperCase() : '?'}
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <p style={{ fontSize: 15, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628', margin: '0 0 3px' }}>{client.name}</p>
                          <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#6a7f9a', margin: '0 0 2px' }}>{client.email}</p>
                          <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#6a7f9a', margin: '0 0 2px' }}>📞 {client.phone || 'N/A'}</p>
                          <p style={{ fontSize: 11, color: d ? '#3a5a7a' : '#aab8c8', margin: 0 }}>
                            Joined {new Date(client.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleDeleteUser(client.id, 'client')}
                          className="btn-red"
                          style={{
                            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                            border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                            background: '#ef4444', color: '#ffffff', transition: 'background 0.2s',
                          }}
                        >
                          🗑️ Delete
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>
                    Bookings Management
                  </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {bookings.length === 0 ? (
                    <div style={emptyStyle}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                      <p style={{ color: d ? '#5a7a9a' : '#8a9ab0', fontSize: 14 }}>No bookings yet.</p>
                    </div>
                  ) : (
                    bookings.map((booking) => {
                      const status = statusConfig[booking.status] || statusConfig.pending;
                      return (
                        <motion.div
                          key={booking.id}
                          className="admin-card"
                          style={cardStyle}
                        >
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                            <div>
                              <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                background: status.bg, border: `1px solid ${status.border}`,
                                color: status.color, fontSize: 11, fontWeight: 600,
                                padding: '3px 10px', borderRadius: 20, marginBottom: 10,
                              }}>
                                {booking.status?.toUpperCase()}
                              </div>
                              <p style={{ fontSize: 14, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628', margin: '0 0 4px' }}>
                                👤 {booking.client_name}
                                <span style={{ fontSize: 12, color: d ? '#5a7a9a' : '#8a9ab0', fontWeight: 400 }}> → </span>
                                ⚖️ {booking.advisor_name}
                              </p>
                              <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#6a7f9a', margin: '0 0 4px' }}>
                                📅 {new Date(booking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                &nbsp;🕐 {booking.booking_time}
                              </p>
                              {booking.message && (
                                <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#8a9ab0', fontStyle: 'italic', margin: 0 }}>
                                  "{booking.message.length > 100 ? booking.message.substring(0, 100) + '...' : booking.message}"
                                </p>
                              )}
                            </div>
                            <p style={{ fontSize: 11, color: d ? '#3a5a7a' : '#aab8c8' }}>
                              {new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {/* BLOGS TAB */}
            {activeTab === 'blogs' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>
                    Blogs Management
                  </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {blogs.length === 0 ? (
                    <div style={emptyStyle}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
                      <p style={{ color: d ? '#5a7a9a' : '#8a9ab0', fontSize: 14 }}>No blogs yet.</p>
                    </div>
                  ) : (
                    blogs.map((blog) => (
                      <motion.div
                        key={blog.id}
                        className="admin-card"
                        style={{ ...cardStyle, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}
                      >
                        <div style={{ flex: 1, minWidth: 200 }}>
                          {blog.category && (
                            <div style={{
                              display: 'inline-flex', marginBottom: 8,
                              background: 'rgba(26,86,219,0.1)', border: '1px solid rgba(26,86,219,0.2)',
                              color: '#4a9eff', fontSize: 11, fontWeight: 600,
                              padding: '3px 10px', borderRadius: 20,
                            }}>
                              {blog.category}
                            </div>
                          )}
                          <p style={{ fontSize: 15, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628', margin: '0 0 4px' }}>{blog.title}</p>
                          <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#6a7f9a', margin: '0 0 2px' }}>
                            By {blog.author_name}
                            <span style={{ background: 'rgba(26,86,219,0.1)', color: '#4a9eff', fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 10, marginLeft: 6 }}>
                              {blog.author_role}
                            </span>
                          </p>
                          <p style={{ fontSize: 11, color: d ? '#3a5a7a' : '#aab8c8', margin: 0 }}>
                            {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            &nbsp;•&nbsp; ❤️ {blog.likes || 0} likes
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="btn-red"
                          style={{
                            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                            border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                            background: '#ef4444', color: '#ffffff', transition: 'background 0.2s',
                          }}
                        >
                          🗑️ Delete
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;