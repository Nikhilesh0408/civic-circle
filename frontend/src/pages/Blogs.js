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
            onClick={() => navigate('/blogs/create')}
            className="px-5 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300"
          >
            Write Blog
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className={`relative z-10 px-10 py-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-center mb-2"
        >
          Legal <span className="text-yellow-400">Blogs</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-center mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Read and share legal knowledge with the community
        </motion.p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-300 ${
                (cat === 'All' && category === '') || category === cat
                  ? 'bg-yellow-400 text-black'
                  : darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="relative z-10 px-10 py-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-6xl mb-4 inline-block"
            >
              ⚖️
            </motion.div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📝</div>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No blogs yet!</p>
            <p className={`mb-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Be the first to write a blog</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/blogs/create')}
              className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300"
            >
              Write First Blog
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <span className="text-yellow-400 font-bold">{blogs.length}</span> blogs found
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(250,204,21,0.2)' }}
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  className={`border rounded-2xl overflow-hidden cursor-pointer transition duration-300 ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-yellow-400' : 'bg-gray-100 border-gray-200 hover:border-yellow-400'}`}
                >
                  {/* Blog Image */}
                  {blog.image_url ? (
                    <img src={blog.image_url} alt={blog.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className={`w-full h-48 flex items-center justify-center text-6xl ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      📝
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className="p-6">
                    {blog.category && (
                      <span className="text-xs font-bold text-yellow-400 bg-yellow-400 bg-opacity-10 px-3 py-1 rounded-full">
                        {blog.category}
                      </span>
                    )}
                    <h3 className="text-xl font-bold mt-3 mb-2 line-clamp-2">{blog.title}</h3>
                    <p className={`text-sm line-clamp-3 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {blog.content}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black text-sm font-bold">
                        {blog.author_name ? blog.author_name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{blog.author_name}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                      </div>
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