import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', formData);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials!');
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} flex items-center justify-center px-4 transition-all duration-500`}>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${darkMode ? 'bg-yellow-400' : 'bg-gray-800'}`}
            style={{
              width: Math.random() * 10 + 3,
              height: Math.random() * 10 + 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.15,
            }}
            animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative z-10 border rounded-2xl p-10 w-full max-w-md ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="text-3xl font-bold text-yellow-400">Admin Panel</h2>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Civic Circle Administration</p>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`px-4 py-3 rounded-xl border focus:outline-none focus:border-yellow-400 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`px-4 py-3 rounded-xl border focus:outline-none focus:border-yellow-400 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
            required
          />
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(250,204,21,0.4)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition duration-300"
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </motion.button>
        </form>

        <p className={`text-center mt-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          This page is for administrators only
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;