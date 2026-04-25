import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const Blogs = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = category ? `?category=${category}` : '';
      const res = await axios.get(`http://localhost:5000/api/blogs${params}`);
      setBlogs(res.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, [category]);

  const categories = ['All', 'Criminal Law', 'Civil Law', 'Family Law', 'Corporate Law', 'Property Law', 'General'];

  const d = darkMode;
  const avatarColors = ['#1a56db', '#0d5f3a', '#7c3aed', '#b45309', '#be185d'];
  const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

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
        .blog-card { transition: border-color 0.2s, transform 0.2s; }
        .blog-card:hover { border-color: #1a56db !important; transform: translateY(-4px); }
        .cat-btn { transition: all 0.2s; cursor: pointer; font-family: 'Inter', sans-serif; border: none; }
        .cat-btn:hover { border-color: #1a56db !important; color: #1a56db !important; }
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .write-btn:hover { background: #1540a8 !important; }
        .hero-grid-bg {
          background-image: linear-gradient(rgba(26,86,219,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,86,219,0.06) 1px, transparent 1px);
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
          <button className="write-btn" onClick={() => navigate('/blogs/create')} style={{
            padding: '8px 20px', borderRadius: 6, background: '#1a56db', border: 'none',
            color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>✍️ Write Blog</button>
        </div>
      </nav>

      {/* ── HEADER ── */}
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
            Legal Knowledge Hub
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
            textAlign: 'center', color: '#ffffff',
            marginBottom: 10, letterSpacing: '-0.3px',
          }}
        >
          Legal <span style={{ color: '#4a9eff' }}>Blogs</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ textAlign: 'center', color: '#8ab0d0', fontSize: 15, marginBottom: 32 }}
        >
          Read and share legal knowledge with the community
        </motion.p>

        {/* ── CATEGORY FILTER ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 700, margin: '0 auto' }}
        >
          {categories.map((cat) => {
            const isActive = (cat === 'All' && category === '') || category === cat;
            return (
              <button
                key={cat}
                className="cat-btn"
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                style={{
                  padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  background: isActive ? '#1a56db' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#ffffff' : '#93b8f5',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* ── BLOGS GRID ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '40px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ fontSize: 52, display: 'inline-block', marginBottom: 16 }}>⚖️</motion.div>
            <p style={{ color: d ? '#5a7a9a' : '#7a8fa8', fontSize: 15 }}>Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📝</div>
            <p style={{ fontSize: 20, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628', marginBottom: 8 }}>No blogs yet!</p>
            <p style={{ color: d ? '#5a7a9a' : '#7a8fa8', marginBottom: 28, fontSize: 14 }}>Be the first to write a blog</p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/blogs/create')}
              style={{
                padding: '12px 28px', background: '#1a56db', color: '#ffffff',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
              Write First Blog
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ marginBottom: 24, fontSize: 14, color: d ? '#5a7a9a' : '#7a8fa8' }}>
              <span style={{ color: '#1a56db', fontWeight: 700 }}>{blogs.length}</span> blog{blogs.length !== 1 ? 's' : ''} found
            </motion.p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  className="blog-card"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  style={{
                    background: d ? '#0d1f3c' : '#ffffff',
                    border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                    borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                  }}
                >
                  {/* Cover Image */}
                  {blog.image_url ? (
                    <img src={blog.image_url} alt={blog.title}
                      style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{
                      width: '100%', height: 180,
                      background: d ? '#0a1628' : '#eff4ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 48, borderBottom: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                    }}>📝</div>
                  )}

                  {/* Card Body */}
                  <div style={{ padding: '18px 18px 20px' }}>
                    {blog.category && (
                      <span style={{
                        display: 'inline-block', fontSize: 10, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.7px',
                        color: '#1a56db', background: 'rgba(26,86,219,0.1)',
                        border: '1px solid rgba(26,86,219,0.2)',
                        padding: '3px 10px', borderRadius: 20, marginBottom: 10,
                      }}>{blog.category}</span>
                    )}

                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 17, fontWeight: 700,
                      color: d ? '#e8f0fe' : '#0a1628',
                      lineHeight: 1.35, marginBottom: 8,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{blog.title}</h3>

                    <p style={{
                      fontSize: 13, color: d ? '#5a7a9a' : '#6a7f9a',
                      lineHeight: 1.65, marginBottom: 16,
                      display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{blog.content}</p>

                    {/* Author Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: d ? '1px solid #1e3a5f' : '1px solid #f0f4f8' }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: getColor(blog.author_name),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#ffffff', flexShrink: 0,
                      }}>
                        {blog.author_name ? blog.author_name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628' }}>{blog.author_name}</p>
                        <p style={{ fontSize: 11, color: d ? '#3a5a7a' : '#aab8c8' }}>
                          {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <span style={{
                        marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                        color: '#1a56db', textTransform: 'capitalize',
                      }}>{blog.author_role}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blogs;