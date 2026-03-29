import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = role === 'client'
        ? 'http://localhost:5000/api/auth/register/client'
        : 'http://localhost:5000/api/auth/register/advisor';
      const res = await axios.post(url, { ...formData });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Registration Successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">⚖️ Register</h2>

        {/* Role Selector */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setRole('client')}
            className={`flex-1 py-3 rounded-xl font-semibold transition duration-300 ${role === 'client' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}
          >
            Client
          </button>
          <button
            onClick={() => setRole('advisor')}
            className={`flex-1 py-3 rounded-xl font-semibold transition duration-300 ${role === 'advisor' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}
          >
            Legal Advisor
          </button>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400"
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition duration-300"
          >
            {loading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="text-yellow-400 cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;