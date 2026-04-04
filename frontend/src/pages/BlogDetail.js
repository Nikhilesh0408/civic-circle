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
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
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
      navigator.share({
        title: blog.title,
        text: blog.content.substring(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-6xl"
      >
        ⚖️
      </motion.div>
    </div>
  );

  if (!blog) return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <p>Blog not found!</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} transition-all duration-500`}>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${darkMode ? 'bg-yellow-400' : 'bg-gray-800'}`}
            style={{
              width: Math.random() * 8 + 3,
              height: Math.random() * 8 + 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`relative z-10 flex justify-between items-center px-10 py-5 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <h1 onClick={() => navigate('/')} className="text-2xl font-bold text-yellow-500 cursor-pointer">
          ⚖️ Civic Circle
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-full border transition duration-300 text-sm font-semibold ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={() => navigate('/blogs')}
            className={`px-5 py-2 border rounded-full transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
          >
            Back to Blogs
          </button>
        </div>
      </nav>

      {/* Blog Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">

        {/* Blog Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {blog.category && (
            <span className="text-xs font-bold text-yellow-400 bg-yellow-400 bg-opacity-10 px-3 py-1 rounded-full">
              {blog.category}
            </span>
          )}
          <h1 className="text-4xl font-extrabold mt-4 mb-4">{blog.title}</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
              {blog.author_name ? blog.author_name[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-semibold">{blog.author_name}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {blog.author_role} • {new Date(blog.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Blog Image */}
        {blog.image_url && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Blog Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`border rounded-3xl p-8 mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
        >
          <p className={`text-lg leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {blog.content}
          </p>
        </motion.div>

        {/* Like Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`border rounded-3xl p-6 mb-6 flex items-center gap-4 flex-wrap ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition duration-300 ${liked ? 'bg-red-500 text-white' : darkMode ? 'bg-gray-800 text-white hover:bg-red-500' : 'bg-white text-gray-900 hover:bg-red-500 hover:text-white'}`}
          >
            {liked ? '❤️' : '🤍'} {likes} Likes
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition duration-300 ${darkMode ? 'bg-gray-800 text-white hover:bg-yellow-400 hover:text-black' : 'bg-white text-gray-900 hover:bg-yellow-400'}`}
          >
            🔗 Share
          </motion.button>

          <span className={`ml-auto text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            💬 {comments.length} Comments
          </span>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`border rounded-3xl p-8 mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
        >
          <h3 className="text-2xl font-bold mb-6 text-yellow-400">💬 Comments ({comments.length})</h3>

          {/* Add Comment */}
          {user ? (
            <form onSubmit={handleComment} className="flex flex-col gap-3 mb-8">
              <textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:border-yellow-400 resize-none transition duration-300 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={commentLoading}
                className="self-end px-6 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300"
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </motion.button>
            </form>
          ) : (
            <div className={`p-4 rounded-xl mb-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                <span onClick={() => navigate('/login')} className="text-yellow-400 cursor-pointer hover:underline">Login</span> to comment
              </p>
            </div>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className={`text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c, index) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black text-sm font-bold">
                      {c.author_name ? c.author_name[0].toUpperCase() : '?'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{c.author_name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(c.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {user && user.id === c.author_id && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-red-400 hover:text-red-500 text-sm font-bold px-3 py-1 rounded-full hover:bg-red-400 hover:bg-opacity-10 transition duration-300"
                      >
                        Delete
                      </motion.button>
                    )}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{c.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Author Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`border rounded-3xl p-6 mb-8 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
        >
          <h3 className="text-lg font-bold mb-3 text-yellow-400">About the Author</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-black text-xl font-bold">
              {blog.author_name ? blog.author_name[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-bold text-lg">{blog.author_name}</p>
              <p className={`text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{blog.author_role} on Civic Circle</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border border-yellow-400 rounded-3xl p-8 text-center"
          style={{ background: darkMode ? 'rgba(17,24,39,0.9)' : 'rgba(243,244,246,0.9)' }}
        >
          <h2 className="text-2xl font-bold mb-2">Need Legal Help?</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Connect with verified legal advisors on Civic Circle!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/search')}
            className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300"
          >
            Find a Lawyer
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

export default BlogDetail;