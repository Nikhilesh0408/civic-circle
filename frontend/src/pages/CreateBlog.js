import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ title: '', content: '', category: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) { navigate('/login'); return null; }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('author_name', user.name);
      data.append('author_id', user.id);
      data.append('author_role', user.role);
      if (image) data.append('blog_image', image);
      await axios.post('http://localhost:5000/api/blogs/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Blog published successfully!');
      navigate('/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish blog!');
    }
    setLoading(false);
  };

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
        .blog-input {
          width: 100%; padding: 11px 14px; border-radius: 8px;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .blog-input:focus {
          border-color: #1a56db !important;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.12);
        }
        .blog-input::placeholder { opacity: 0.5; }
        .blog-input option { background: #0d1f3c; }
        .upload-zone:hover { border-color: #1a56db !important; }
        .upload-zone { transition: border-color 0.2s; }
        .publish-btn:hover:not(:disabled) { background: #1540a8 !important; }
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .hero-grid-bg {
          background-image: linear-gradient(rgba(26,86,219,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,86,219,0.05) 1px, transparent 1px);
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
          <button className="nav-ghost" onClick={() => navigate('/blogs')} style={{
            padding: '7px 18px', borderRadius: 6,
            border: d ? '1px solid #2d4a6e' : '1px solid #c5d5e8',
            color: d ? '#a8c0d6' : '#4a6080', fontSize: 13, fontWeight: 500,
            background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
          }}>← Back to Blogs</button>
        </div>
      </nav>

      {/* ── FORM ── */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 720, margin: '0 auto', padding: '36px 24px 60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{
            background: d ? '#0d1f3c' : '#ffffff',
            border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            borderRadius: 16, padding: '36px 32px',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 3, height: 22, background: '#1a56db', borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>
                Write a Blog
              </h2>
            </div>
            <p style={{ fontSize: 14, color: d ? '#5a7a9a' : '#7a8fa8', paddingLeft: 11 }}>
              Share your legal knowledge with the community
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)',
              color: '#f87171', borderRadius: 8, padding: '10px 14px',
              fontSize: 13, marginBottom: 20,
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Title */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: d ? '#5a7a9a' : '#7a8fa8', display: 'block', marginBottom: 7 }}>
                Blog Title *
              </label>
              <input
                type="text"
                placeholder="Enter a compelling title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="blog-input"
                required
                style={{
                  background: d ? '#0a1628' : '#f8fafc',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  color: d ? '#c8ddf5' : '#0a1628',
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: d ? '#5a7a9a' : '#7a8fa8', display: 'block', marginBottom: 7 }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="blog-input"
                style={{
                  background: d ? '#0a1628' : '#f8fafc',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  color: formData.category ? (d ? '#c8ddf5' : '#0a1628') : (d ? 'rgba(200,221,245,0.4)' : 'rgba(10,22,40,0.35)'),
                }}
              >
                <option value="">Select Category</option>
                <option value="Criminal Law">Criminal Law</option>
                <option value="Civil Law">Civil Law</option>
                <option value="Family Law">Family Law</option>
                <option value="Corporate Law">Corporate Law</option>
                <option value="Property Law">Property Law</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: d ? '#5a7a9a' : '#7a8fa8', display: 'block', marginBottom: 7 }}>
                Cover Image (optional)
              </label>
              <div className="upload-zone" style={{
                border: d ? '1.5px dashed #1e3a5f' : '1.5px dashed #c5d5e8',
                borderRadius: 10, padding: '18px 16px', textAlign: 'center',
                background: d ? '#0a1628' : '#f8fafc',
              }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>🖼️</div>
                <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#7a8fa8', marginBottom: 10 }}>
                  Upload a cover image for your blog
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', fontSize: 12, color: d ? '#6a8aaa' : '#7a8fa8' }}
                />
                {imagePreview && (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      marginTop: 14, width: '100%', height: 180,
                      objectFit: 'cover', borderRadius: 8,
                      border: '2px solid #1a56db',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: d ? '#5a7a9a' : '#7a8fa8', display: 'block', marginBottom: 7 }}>
                Content *
              </label>
              <textarea
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="blog-input"
                required
                style={{
                  background: d ? '#0a1628' : '#f8fafc',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  color: d ? '#c8ddf5' : '#0a1628',
                  resize: 'vertical',
                  lineHeight: 1.75,
                }}
              />
            </div>

            {/* Author Info */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              background: d ? '#0a1628' : '#f8fafc',
              border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
              borderRadius: 10,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', background: avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: '#ffffff', flexShrink: 0,
              }}>
                {user.name ? user.name[0].toUpperCase() : '?'}
              </div>
              <div>
                <p style={{ fontSize: 11, color: d ? '#5a7a9a' : '#7a8fa8', marginBottom: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Publishing as
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: d ? '#c8ddf5' : '#0a1628' }}>
                  {user.name}{' '}
                  <span style={{ fontSize: 11, color: '#1a56db', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    · {user.role}
                  </span>
                </p>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="publish-btn"
              style={{
                padding: '13px', marginTop: 4,
                background: loading ? '#3a5a9a' : '#1a56db',
                color: '#ffffff', border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
                width: '100%',
              }}
            >
              {loading ? 'Publishing...' : '📝 Publish Blog'}
            </motion.button>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateBlog;