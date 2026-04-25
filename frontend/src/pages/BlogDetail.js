import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data.blog);
        setLikes(res.data.blog.likes || 0);
        const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
        if (likedBlogs.includes(id)) setLiked(true);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
      setLoading(false);
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}/comments`);
        setComments(res.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/blogs/${id}/like`);
      setLikes(res.data.likes);
      setLiked(true);
      const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
      likedBlogs.push(id);
      localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/blogs/${id}/comment`, {
        comment,
        author_name: user.name,
        author_id: user.id,
        author_role: user.role,
      });
      setComments([res.data.comment, ...comments]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    setCommentLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/comment/${commentId}`, {
          data: { author_id: user.id }
        });
        setComments(comments.filter(c => c.id !== commentId));
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog.title, text: blog.content.substring(0, 100), url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const d = darkMode;
  const avatarColors = ['#1a56db', '#0d5f3a', '#7c3aed', '#b45309', '#be185d'];
  const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: d ? '#0a1628' : '#f0f4f8' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 52 }}>⚖️</motion.div>
    </div>
  );

  if (!blog) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: d ? '#0a1628' : '#f0f4f8', color: d ? '#e8f0fe' : '#0a1628', fontFamily: 'Inter, sans-serif' }}>
      <p>Blog not found!</p>
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
        .comment-input {
          width: 100%; padding: 11px 14px; border-radius: 8px;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; resize: none;
          transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
        }
        .comment-input:focus {
          border-color: #1a56db !important;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.12);
        }
        .comment-input::placeholder { opacity: 0.5; }
        .nav-ghost:hover { background: rgba(255,255,255,0.06); }
        .like-btn:hover { background: rgba(239,68,68,0.15) !important; border-color: rgba(239,68,68,0.4) !important; }
        .share-btn:hover { background: rgba(26,86,219,0.15) !important; border-color: #1a56db !important; }
        .post-btn:hover:not(:disabled) { background: #1540a8 !important; }
        .comment-card { transition: border-color 0.2s; }
        .comment-card:hover { border-color: #1e3a5f !important; }
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

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 760, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* ── BLOG HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ marginBottom: 28 }}>
          {blog.category && (
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.8px', color: '#1a56db',
              background: 'rgba(26,86,219,0.1)', border: '1px solid rgba(26,86,219,0.25)',
              padding: '4px 12px', borderRadius: 20, marginBottom: 16,
            }}>{blog.category}</span>
          )}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700,
            color: d ? '#e8f0fe' : '#0a1628',
            lineHeight: 1.25, marginBottom: 20, letterSpacing: '-0.3px',
          }}>{blog.title}</h1>

          {/* Author Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: getColor(blog.author_name),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, fontWeight: 700, color: '#ffffff', flexShrink: 0,
            }}>
              {blog.author_name ? blog.author_name[0].toUpperCase() : '?'}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: d ? '#c8ddf5' : '#0a1628' }}>{blog.author_name}</p>
              <p style={{ fontSize: 12, color: d ? '#5a7a9a' : '#7a8fa8' }}>
                <span style={{ textTransform: 'capitalize' }}>{blog.author_role}</span>
                {' · '}
                {new Date(blog.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── COVER IMAGE ── */}
        {blog.image_url && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={blog.image_url}
            alt={blog.title}
            style={{
              width: '100%', height: 260, objectFit: 'cover',
              borderRadius: 12, marginBottom: 24,
              border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            }}
          />
        )}

        {/* ── BLOG BODY ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{
            background: d ? '#0d1f3c' : '#ffffff',
            border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            borderRadius: 16, padding: '32px 28px', marginBottom: 16,
          }}
        >
          <p style={{
            fontSize: 16, lineHeight: 1.9,
            color: d ? '#a8c0d6' : '#2a3a4a',
            whiteSpace: 'pre-wrap', fontWeight: 400,
          }}>{blog.content}</p>
        </motion.div>

        {/* ── LIKE / SHARE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{
            background: d ? '#0d1f3c' : '#ffffff',
            border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            borderRadius: 16, padding: '16px 20px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}
        >
          <motion.button
            whileHover={{ scale: liked ? 1 : 1.04 }}
            whileTap={{ scale: liked ? 1 : 0.96 }}
            onClick={handleLike}
            className={liked ? '' : 'like-btn'}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13,
              cursor: liked ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              background: liked ? 'rgba(239,68,68,0.15)' : 'transparent',
              border: liked ? '1px solid rgba(239,68,68,0.4)' : (d ? '1px solid #1e3a5f' : '1px solid #dde5ef'),
              color: liked ? '#f87171' : (d ? '#a8c0d6' : '#4a6080'),
            }}
          >
            {liked ? '❤️' : '🤍'} {likes} {liked ? 'Liked' : 'Like'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={handleShare}
            className="share-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              background: 'transparent',
              border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
              color: d ? '#a8c0d6' : '#4a6080',
            }}
          >
            🔗 Share
          </motion.button>

          <span style={{ marginLeft: 'auto', fontSize: 13, color: d ? '#3a5a7a' : '#aab8c8', fontWeight: 500 }}>
            💬 {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </span>
        </motion.div>

        {/* ── COMMENTS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            background: d ? '#0d1f3c' : '#ffffff',
            border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            borderRadius: 16, padding: '28px', marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
            <div style={{ width: 3, height: 18, background: '#1a56db', borderRadius: 2 }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: d ? '#e8f0fe' : '#0a1628', margin: 0 }}>
              Comments ({comments.length})
            </h3>
          </div>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleComment} style={{ marginBottom: 24 }}>
              <textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="comment-input"
                required
                style={{
                  background: d ? '#0a1628' : '#f8fafc',
                  border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  color: d ? '#c8ddf5' : '#0a1628',
                  marginBottom: 10,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={commentLoading}
                  className="post-btn"
                  style={{
                    padding: '9px 22px', background: commentLoading ? '#3a5a9a' : '#1a56db',
                    color: '#ffffff', border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: commentLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
                  }}
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </motion.button>
              </div>
            </form>
          ) : (
            <div style={{
              padding: '14px 16px', borderRadius: 10, marginBottom: 20, textAlign: 'center',
              background: d ? '#0a1628' : '#f8fafc',
              border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            }}>
              <p style={{ fontSize: 14, color: d ? '#5a7a9a' : '#7a8fa8' }}>
                <span onClick={() => navigate('/login')} style={{ color: '#1a56db', cursor: 'pointer', fontWeight: 600 }}>Login</span>
                {' '}to leave a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <p style={{ textAlign: 'center', color: d ? '#3a5a7a' : '#aab8c8', fontSize: 14, padding: '20px 0' }}>
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {comments.map((c, index) => (
                <motion.div
                  key={c.id}
                  className="comment-card"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
                  style={{
                    padding: '14px 16px', borderRadius: 10,
                    background: d ? '#0a1628' : '#f8fafc',
                    border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: getColor(c.author_name),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#ffffff', flexShrink: 0,
                    }}>
                      {c.author_name ? c.author_name[0].toUpperCase() : '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: d ? '#c8ddf5' : '#0a1628' }}>{c.author_name}</p>
                      <p style={{ fontSize: 11, color: d ? '#3a5a7a' : '#aab8c8' }}>
                        {new Date(c.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {user && user.id === c.author_id && (
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteComment(c.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 11, color: '#f87171', fontWeight: 600,
                          padding: '3px 8px', borderRadius: 6,
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >Delete</motion.button>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: d ? '#8ab0d0' : '#3a4a5a', lineHeight: 1.65 }}>{c.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── AUTHOR CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          style={{
            background: d ? '#0d1f3c' : '#ffffff',
            border: d ? '1px solid #1e3a5f' : '1px solid #dde5ef',
            borderRadius: 16, padding: '22px 24px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 16,
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: getColor(blog.author_name),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#ffffff', flexShrink: 0,
          }}>
            {blog.author_name ? blog.author_name[0].toUpperCase() : '?'}
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: '#1a56db', marginBottom: 4 }}>
              About the Author
            </p>
            <p style={{ fontWeight: 600, fontSize: 15, color: d ? '#c8ddf5' : '#0a1628', marginBottom: 2 }}>{blog.author_name}</p>
            <p style={{ fontSize: 13, color: d ? '#5a7a9a' : '#7a8fa8', textTransform: 'capitalize' }}>
              {blog.author_role} on Civic Circle
            </p>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #0d2145, #1a3a6e)',
            border: '1px solid #1e3a5f',
            borderRadius: 16, padding: '36px 28px', textAlign: 'center',
          }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
            Need Legal Help?
          </h2>
          <p style={{ color: '#7a9aba', marginBottom: 24, fontSize: 14, lineHeight: 1.65 }}>
            Connect with verified legal advisors on Civic Circle!
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/search')}
            style={{
              padding: '11px 28px', background: '#1a56db', color: '#ffffff',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            Find a Lawyer →
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

export default BlogDetail;