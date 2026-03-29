import React, { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import gsap from 'gsap';

const Home = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} overflow-hidden transition-all duration-500`}>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`relative z-10 flex justify-between items-center px-10 py-5 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-bold text-yellow-500"
        >
          ⚖️ Civic Circle
        </motion.h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-full border transition duration-300 text-sm font-semibold ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
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
      <div ref={heroRef} className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            ⚖️
          </motion.div>
          <h1 className="text-6xl font-extrabold mb-6 leading-tight">
            Legal Help,{' '}
            <span className="text-yellow-500">Simplified</span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Connect with verified legal advisors instantly. Get expert legal guidance from the comfort of your home.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(250, 204, 21, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/search')}
              className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-full text-lg hover:bg-yellow-300 transition duration-300"
            >
              🔍 Find a Lawyer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className={`px-8 py-4 border font-bold rounded-full text-lg transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}
            >
              ⚖️ Join as Advisor
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 flex justify-center gap-16 py-10 flex-wrap">
        {[
          { number: '500+', label: 'Legal Advisors' },
          { number: '10K+', label: 'Cases Solved' },
          { number: '50+', label: 'Specializations' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="text-center"
          >
            <h2 className="text-4xl font-extrabold text-yellow-400">{stat.number}</h2>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          { icon: '🔍', title: 'Find Experts', desc: 'Search verified legal advisors by specialization, city and language' },
          { icon: '💬', title: 'Chat Instantly', desc: 'Connect and chat with lawyers directly on the platform' },
          { icon: '🤖', title: 'AI Assistant', desc: 'Get instant answers to basic legal questions with our AI chatbot' },
          { icon: '📅', title: 'Book Consultation', desc: 'Schedule appointments with lawyers at your convenience' },
          { icon: '📝', title: 'Legal Blogs', desc: 'Read and publish informative legal articles and guides' },
          { icon: '⭐', title: 'Verified Lawyers', desc: 'All lawyers are verified and rated by real clients' },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(250, 204, 21, 0.2)' }}
            className={`border rounded-2xl p-8 text-center transition duration-300 cursor-pointer ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-yellow-400' : 'bg-gray-100 border-gray-200 hover:border-yellow-400'}`}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-yellow-500">{feature.title}</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 px-10 py-16 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-center mb-16"
        >
          How It <span className="text-yellow-400">Works</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', icon: '📝', title: 'Create Account', desc: 'Sign up as a client or legal advisor in just 2 minutes' },
            { step: '02', icon: '🔍', title: 'Find Your Lawyer', desc: 'Search and filter lawyers by specialization, city and language' },
            { step: '03', icon: '💬', title: 'Get Legal Help', desc: 'Connect, chat and resolve your legal issues easily' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3 }}
              whileHover={{ scale: 1.05 }}
              className={`relative border rounded-2xl p-8 text-center transition duration-300 ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-yellow-400' : 'bg-gray-100 border-gray-200 hover:border-yellow-400'}`}
            >
              <div className="text-5xl font-extrabold text-yellow-400 opacity-20 absolute top-4 right-4">{item.step}</div>
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        className="relative z-10 mx-10 my-10 rounded-3xl p-16 text-center border border-yellow-400"
        style={{ background: darkMode ? 'rgba(17,24,39,0.9)' : 'rgba(243,244,246,0.9)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-4xl font-extrabold mb-4">Ready to get <span className="text-yellow-400">Legal Help?</span></h2>
        <p className={`mb-8 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Join thousands of people who found the right lawyer on Civic Circle</p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(250, 204, 21, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/register')}
          className="px-10 py-4 bg-yellow-400 text-black font-bold rounded-full text-xl hover:bg-yellow-300 transition duration-300"
        >
          Get Started Free →
        </motion.button>
      </motion.div>

      {/* Footer */}
      <footer className={`relative z-10 text-center py-8 border-t ${darkMode ? 'text-gray-600 border-gray-800' : 'text-gray-400 border-gray-200'}`}>
        <p>© 2024 Civic Circle. Making Legal Help Accessible for Everyone! ⚖️</p>
      </footer>

    </div>
  );
};

export default Home;