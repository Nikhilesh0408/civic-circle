import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const Register = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    city: '',
    bio: '',
    experience_duration: '',
    languages_known: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [barCertificate, setBarCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = role === 'client'
        ? 'http://localhost:5000/api/auth/register/client'
        : 'http://localhost:5000/api/auth/register/advisor';

      let res;
      if (role === 'advisor') {
        // Use FormData for file uploads
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (profilePhoto) data.append('profile_photo', profilePhoto);
        if (barCertificate) data.append('bar_certificate', barCertificate);
        res = await axios.post(url, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post(url, formData);
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Registration Successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    }
    setLoading(false);
  };

  const inputClass = `px-4 py-3 rounded-xl border focus:outline-none focus:border-yellow-400 transition duration-300 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-white'} flex items-center justify-center px-4 py-10 transition-all duration-500`}>

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
        className={`relative z-10 border rounded-2xl p-10 w-full max-w-lg ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
      >
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">⚖️ Register</h2>

        {/* Role Selector */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setRole('client')}
            className={`flex-1 py-3 rounded-xl font-semibold transition duration-300 ${role === 'client' ? 'bg-yellow-400 text-black' : darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          >
            👤 Client
          </button>
          <button
            onClick={() => setRole('advisor')}
            className={`flex-1 py-3 rounded-xl font-semibold transition duration-300 ${role === 'advisor' ? 'bg-yellow-400 text-black' : darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          >
            ⚖️ Legal Advisor
          </button>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass} required />

          <input type="email" placeholder="Email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass} required />

          <input type="password" placeholder="Password" value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={inputClass} required />

          <input type="text" placeholder="Phone Number" value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={inputClass} />

          {/* Extra Fields for Legal Advisor */}
          <AnimatePresence>
            {role === 'advisor' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 overflow-hidden"
              >
                <div className={`border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  <p className="text-yellow-400 font-semibold mb-3">⚖️ Professional Details</p>
                </div>

                <input type="text" placeholder="Specialization (e.g. Criminal Law)"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className={inputClass} required />

                <input type="text" placeholder="City (e.g. Mumbai, Delhi)"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={inputClass} required />

                <input type="text" placeholder="Experience Duration (e.g. 5 years)"
                  value={formData.experience_duration}
                  onChange={(e) => setFormData({ ...formData, experience_duration: e.target.value })}
                  className={inputClass} />

                <input type="text" placeholder="Languages Known (e.g. English, Hindi)"
                  value={formData.languages_known}
                  onChange={(e) => setFormData({ ...formData, languages_known: e.target.value })}
                  className={inputClass} />

                <textarea placeholder="Bio — Tell clients about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className={`${inputClass} resize-none`} />

                <div className={`border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  <p className="text-yellow-400 font-semibold mb-3">📎 Upload Documents</p>
                </div>

                {/* Profile Photo Upload */}
                <div className={`border-2 border-dashed rounded-xl p-4 text-center ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  <p className={`mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>📸 Profile Photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                    className="w-full text-sm text-gray-400"
                  />
                  {profilePhoto && <p className="text-green-400 text-xs mt-1">✅ {profilePhoto.name}</p>}
                </div>

                {/* Bar Certificate Upload */}
                <div className={`border-2 border-dashed rounded-xl p-4 text-center ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  <p className={`mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>📄 Bar Council Certificate</p>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setBarCertificate(e.target.files[0])}
                    className="w-full text-sm text-gray-400"
                  />
                  {barCertificate && <p className="text-green-400 text-xs mt-1">✅ {barCertificate.name}</p>}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(250,204,21,0.4)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition duration-300"
          >
            {loading ? 'Registering...' : `Register as ${role === 'client' ? 'Client' : 'Legal Advisor'}`}
          </motion.button>
        </form>

        <p className={`text-center mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="text-yellow-400 cursor-pointer hover:underline">
            Login
          </span>
        </p>

        <p className={`text-center mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span onClick={() => navigate('/')} className="text-yellow-400 cursor-pointer hover:underline">
            ← Back to Home
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;