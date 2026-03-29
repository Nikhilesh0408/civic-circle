import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const Home = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} overflow-hidden transition-all duration-500`}>

      {/* Navbar */}
      <nav className={`flex justify-between items-center px-10 py-5 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-bold text-yellow-500"
        >
          ⚖️ Civic Circle
        </motion.h1>
        <div className="flex gap-4 items-center">

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-full border transition duration-300 text-sm font-semibold ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          <button
            onClick={() => navigate('/login')}
            className={`px-5 py-2 border rounded-full transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-300 transition duration-300"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-extrabold mb-6 leading-tight">
            Legal Help,{' '}
            <span className="text-yellow-500">Simplified</span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Connect with verified legal advisors instantly. Get expert legal guidance from the comfort of your home.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-full text-lg hover:bg-yellow-300 transition duration-300"
            >
              Find a Lawyer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className={`px-8 py-4 border font-bold rounded-full text-lg transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
            >
              Join as Lawyer
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          { icon: '🔍', title: 'Find Experts', desc: 'Search verified legal advisors by specialization, city and language' },
          { icon: '💬', title: 'Chat Instantly', desc: 'Connect and chat with lawyers directly on the platform' },
          { icon: '🤖', title: 'AI Assistant', desc: 'Get instant answers to basic legal questions with our AI chatbot' },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className={`border rounded-2xl p-8 text-center transition duration-300 ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-yellow-400' : 'bg-gray-100 border-gray-200 hover:border-yellow-400'}`}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-yellow-500">{feature.title}</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className={`text-center py-8 border-t ${darkMode ? 'text-gray-600 border-gray-800' : 'text-gray-400 border-gray-200'}`}>
        <p>© 2024 Civic Circle. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Home;