import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [id]);

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

  if (!lawyer) return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <p>Lawyer not found!</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} transition-all duration-500`}>

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

      <nav className={`relative z-10 flex justify-between items-center px-10 py-5 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <h1 onClick={() => navigate('/')} className="text-2xl font-bold text-yellow-500 cursor-pointer">
          Civic Circle
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-full border transition duration-300 text-sm font-semibold ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={() => navigate('/search')}
            className={`px-5 py-2 border rounded-full transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
          >
            Back to Search
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`border rounded-3xl p-8 mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {lawyer.profile_photo && lawyer.profile_photo !== '' ? (
              <img
                src={lawyer.profile_photo}
                alt={lawyer.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center text-black text-5xl font-bold shadow-lg">
                {lawyer.name ? lawyer.name[0].toUpperCase() : '?'}
              </div>
            )}

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="text-3xl font-extrabold">{lawyer.name}</h1>
                {lawyer.is_verified && (
                  <span className="bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-full">Verified</span>
                )}
              </div>
              <p className="text-yellow-400 text-xl font-semibold mb-2">{lawyer.specialization}</p>
              <div className={`flex flex-wrap gap-4 justify-center md:justify-start text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {lawyer.city && <span>📍 {lawyer.city}</span>}
                {lawyer.experience_duration && <span>💼 {lawyer.experience_duration} experience</span>}
                {lawyer.languages_known && <span>🗣️ {lawyer.languages_known}</span>}
              </div>
              <div className="flex gap-4 mt-4 justify-center md:justify-start flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300"
                >
                  Contact Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className={`px-6 py-2 border font-bold rounded-full transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
                >
                  Book Consultation
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {lawyer.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`border rounded-3xl p-8 mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">About</h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{lawyer.bio}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`border rounded-3xl p-8 mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
        >
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">Professional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '⚖️', label: 'Specialization', value: lawyer.specialization },
              { icon: '📍', label: 'City', value: lawyer.city },
              { icon: '💼', label: 'Experience', value: lawyer.experience_duration },
              { icon: '🗣️', label: 'Languages', value: lawyer.languages_known },
              { icon: '📧', label: 'Email', value: lawyer.email },
              { icon: '📞', label: 'Phone', value: lawyer.phone },
            ].map((detail, index) => detail.value && (
              <div key={index} className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{detail.icon} {detail.label}</p>
                <p className="font-semibold">{detail.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {lawyer.bar_certificate && lawyer.bar_certificate !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={`border rounded-3xl p-8 mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Bar Council Certificate</h2>
            <p className={`mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              This lawyer has submitted their Bar Council Certificate for verification.
            </p>
            <div className={`flex items-center gap-4 p-4 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="text-5xl">📄</div>
              <div className="flex-1">
                <p className="font-bold text-lg">Bar Council Certificate</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Verified legal document submitted by the lawyer</p>
              </div>
              <a
                href={lawyer.bar_certificate}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300 text-sm"
             >
                View
              </a>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-yellow-400 rounded-3xl p-8 text-center"
          style={{ background: darkMode ? 'rgba(17,24,39,0.9)' : 'rgba(243,244,246,0.9)' }}
        >
          <h2 className="text-2xl font-bold mb-2">Need Legal Help from <span className="text-yellow-400">{lawyer.name}?</span></h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Register or login to contact this lawyer directly!</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300"
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className={`px-8 py-3 border font-bold rounded-full transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LawyerProfile;