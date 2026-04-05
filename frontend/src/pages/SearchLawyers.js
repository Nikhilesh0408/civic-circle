import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

// ⭐ Star display
const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-xs ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-500'}`}>★</span>
    ))}
  </div>
);

const SearchLawyers = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [lawyers, setLawyers] = useState([]);
  const [lawyerRatings, setLawyerRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    city: '',
    languages_known: '',
  });

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.city) params.append('city', filters.city);
      if (filters.languages_known) params.append('languages_known', filters.languages_known);

      const res = await axios.get(`http://localhost:5000/api/lawyers?${params}`);
      const fetchedLawyers = res.data.lawyers;
      setLawyers(fetchedLawyers);

      // Fetch ratings for all lawyers in parallel
      const ratingsMap = {};
      await Promise.all(
        fetchedLawyers.map(async (lawyer) => {
          try {
            const ratingRes = await axios.get(`http://localhost:5000/api/reviews/${lawyer.id}`);
            ratingsMap[lawyer.id] = {
              avgRating: ratingRes.data.avgRating,
              totalReviews: ratingRes.data.totalReviews,
            };
          } catch {
            ratingsMap[lawyer.id] = { avgRating: 0, totalReviews: 0 };
          }
        })
      );
      setLawyerRatings(ratingsMap);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  // ✅ Avatar with photo support
  const LawyerAvatar = ({ lawyer }) => {
    const [imgError, setImgError] = useState(false);
    if (lawyer.profile_photo && !imgError) {
      return (
        <img
          src={lawyer.profile_photo}
          alt={lawyer.name}
          className="w-16 h-16 rounded-full object-cover shadow-lg flex-shrink-0"
          onError={() => setImgError(true)}
        />
      );
    }
    return (
      <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-black text-2xl font-bold shadow-lg flex-shrink-0">
        {lawyer.name ? lawyer.name[0].toUpperCase() : '?'}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} transition-all duration-500`}>

      {/* Particles */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${darkMode ? 'bg-yellow-400' : 'bg-gray-700'}`}
            style={{
              width: Math.random() * 12 + 4,
              height: Math.random() * 12 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1,
              borderRadius: i % 2 === 0 ? '0%' : '50%',
              transform: `rotate(${Math.random() * 45}deg)`,
            }}
            animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, 180, 360], opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className={`absolute h-px ${darkMode ? 'bg-yellow-400' : 'bg-gray-400'}`}
            style={{ width: `${Math.random() * 200 + 100}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.1 }}
            animate={{ opacity: [0.05, 0.2, 0.05], scaleX: [1, 1.5, 1] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`relative z-10 flex justify-between items-center px-10 py-5 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate('/')} className="text-2xl font-bold text-yellow-500 cursor-pointer">
          ⚖️ Civic Circle
        </motion.h1>
        <div className="flex gap-4 items-center">
          <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-2 rounded-full border transition duration-300 text-sm font-semibold ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={() => navigate('/login')} className={`px-5 py-2 border rounded-full transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}>Login</button>
          <button onClick={() => navigate('/register')} className="px-5 py-2 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-300 transition duration-300">Get Started</button>
        </div>
      </nav>

      {/* Search Header */}
      <div className={`relative z-10 px-10 py-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold text-center mb-2">
          Find Your <span className="text-yellow-400">Legal Advisor</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className={`text-center mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Search from hundreds of verified legal advisors across India
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="🔍 Search by name..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className={`px-4 py-3 rounded-xl border focus:outline-none focus:border-yellow-400 transition duration-300 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`} />
          <input type="text" placeholder="⚖️ Specialization..." value={filters.specialization} onChange={(e) => setFilters({ ...filters, specialization: e.target.value })} className={`px-4 py-3 rounded-xl border focus:outline-none focus:border-yellow-400 transition duration-300 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`} />
          <input type="text" placeholder="📍 City..." value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className={`px-4 py-3 rounded-xl border focus:outline-none focus:border-yellow-400 transition duration-300 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`} />
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(250,204,21,0.4)' }} whileTap={{ scale: 0.95 }} onClick={fetchLawyers} className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition duration-300">🔍 Search</motion.button>
        </motion.div>
      </div>

      {/* Lawyers Grid */}
      <div className="relative z-10 px-10 py-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-6xl mb-4 inline-block">⚖️</motion.div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Finding lawyers...</p>
          </div>
        ) : lawyers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No lawyers found!</p>
            <p className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Try different filters or register as a legal advisor</p>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/register')} className="mt-6 px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300">Register as Advisor</motion.button>
          </motion.div>
        ) : (
          <>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Found <span className="text-yellow-400 font-bold">{lawyers.length}</span> legal advisors
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lawyers.map((lawyer, index) => {
                const rating = lawyerRatings[lawyer.id];
                return (
                  <motion.div
                    key={lawyer.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(250,204,21,0.2)' }}
                    className={`border rounded-2xl p-6 cursor-pointer transition duration-300 ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-yellow-400' : 'bg-gray-100 border-gray-200 hover:border-yellow-400'}`}
                    onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <LawyerAvatar lawyer={lawyer} />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold">{lawyer.name}</h3>
                        <p className="text-yellow-400 text-sm font-semibold">{lawyer.specialization || 'Legal Advisor'}</p>
                        {lawyer.is_verified && <span className="text-green-400 text-xs">✅ Verified</span>}
                        {/* ⭐ Rating */}
                        {rating && rating.totalReviews > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <StarDisplay rating={rating.avgRating} />
                            <span className="text-yellow-400 text-xs font-bold">{rating.avgRating}</span>
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>({rating.totalReviews})</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {lawyer.city && <p>📍 {lawyer.city}</p>}
                      {lawyer.experience_duration && <p>💼 {lawyer.experience_duration}</p>}
                      {lawyer.languages_known && <p>🗣️ {lawyer.languages_known}</p>}
                      {lawyer.bio && <p className={`line-clamp-2 mt-2 italic ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>"{lawyer.bio}"</p>}
                    </div>
                    <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(250,204,21,0.3)' }} whileTap={{ scale: 0.95 }} className="mt-4 w-full py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition duration-300">
                      View Profile →
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchLawyers;