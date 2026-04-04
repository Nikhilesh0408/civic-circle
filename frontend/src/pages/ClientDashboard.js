import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'client') {
      navigate('/login');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  if (!user) return null;

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
            onClick={handleLogout}
            className="px-5 py-2 border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition duration-300"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`border rounded-3xl p-8 mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-black text-3xl font-bold">
              {user.name ? user.name[0].toUpperCase() : '?'}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Welcome, {user.name}! 👋</h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
              <span className="mt-2 inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">Client</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🔍', title: 'Find a Lawyer', desc: 'Search verified legal advisors', action: () => navigate('/search') },
              { icon: '🤖', title: 'AI Legal Assistant', desc: 'Get instant legal guidance', action: () => navigate('/ai-chat') },
              { icon: '📝', title: 'Legal Blogs', desc: 'Read legal articles and guides', action: () => navigate('/blogs') },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(250,204,21,0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={item.action}
                className={`border rounded-2xl p-6 cursor-pointer transition duration-300 ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-yellow-400' : 'bg-gray-100 border-gray-200 hover:border-yellow-400'}`}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold mb-1 text-yellow-400">{item.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Your Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '📅', label: 'Consultations Booked', value: '0' },
              { icon: '💬', label: 'Messages Sent', value: '0' },
              { icon: '⭐', label: 'Reviews Given', value: '0' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-2xl p-6 text-center ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <h3 className="text-3xl font-extrabold text-yellow-400">{stat.value}</h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`border rounded-3xl p-8 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
        >
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">Legal Tips for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '💡', tip: 'Always consult a lawyer before signing any legal document or contract.' },
              { icon: '🔒', tip: 'Keep copies of all important legal documents in a safe place.' },
              { icon: '⏰', tip: 'Be aware of legal deadlines — missing them can affect your case.' },
              { icon: '📞', tip: 'When in doubt, reach out to a verified legal advisor on Civic Circle.' },
            ].map((item, index) => (
              <div key={index} className={`flex gap-3 p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <span className="text-2xl">{item.icon}</span>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ClientDashboard;