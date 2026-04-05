import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../App';

// ⭐ Star Rating Display Component
const StarDisplay = ({ rating, size = 'sm' }) => {
  const sizeClass = size === 'lg' ? 'text-2xl' : 'text-sm';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-500'}`}>★</span>
      ))}
    </div>
  );
};

// ⭐ Star Rating Input Component
const StarInput = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`text-3xl transition-colors duration-150 ${star <= (hovered || value) ? 'text-yellow-400' : 'text-gray-500'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Get logged-in user from localStorage
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedInClient = currentUser && currentUser.role === 'client';

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
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setTotalReviews(res.data.totalReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
    setReviewsLoading(false);
  };

  const handleSubmitReview = async () => {
    setReviewError('');
    setReviewSuccess('');

    if (reviewForm.rating === 0) {
      setReviewError('Please select a star rating.');
      return;
    }
    if (reviewForm.comment.trim().length < 10) {
      setReviewError('Comment must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/reviews/${id}`, {
        client_id: currentUser.id,
        client_name: currentUser.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      setReviewSuccess('Review submitted successfully! 🎉');
      setReviewForm({ rating: 0, comment: '' });
      setShowReviewForm(false);
      fetchReviews(); // Refresh reviews
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to submit review. Try again.');
    }
    setSubmitting(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        data: { client_id: currentUser.id }
      });
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
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

  if (!lawyer) return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <p>Lawyer not found!</p>
    </div>
  );

  // Check if current user already reviewed
  const alreadyReviewed = isLoggedInClient && reviews.some(r => r.client_id === currentUser.id);

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
          ⚖️ Civic Circle
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

        {/* Profile Header */}
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

              {/* ⭐ Rating summary on profile header */}
              {totalReviews > 0 && (
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <StarDisplay rating={Math.round(avgRating)} size="sm" />
                  <span className="text-yellow-400 font-bold">{avgRating}</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
                </div>
              )}

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

        {/* About */}
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

        {/* Professional Details */}
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

        {/* Bar Certificate */}
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

        {/* ⭐ REVIEWS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`border rounded-3xl p-8 mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
        >
          {/* Reviews Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Client Reviews</h2>
              {totalReviews > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <StarDisplay rating={Math.round(avgRating)} size="sm" />
                  <span className="font-bold text-yellow-400">{avgRating}</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
                </div>
              )}
            </div>

            {/* Write Review Button */}
            {isLoggedInClient && !alreadyReviewed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-5 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300 text-sm"
              >
                {showReviewForm ? 'Cancel' : '✍️ Write a Review'}
              </motion.button>
            )}
            {isLoggedInClient && alreadyReviewed && (
              <span className={`text-sm px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                ✅ You reviewed this lawyer
              </span>
            )}
            {!currentUser && (
              <button
                onClick={() => navigate('/login')}
                className={`text-sm px-4 py-2 rounded-full border transition duration-300 ${darkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white'}`}
              >
                Login to Review
              </button>
            )}
            {currentUser && currentUser.role === 'advisor' && (
              <span className={`text-sm px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                Only clients can leave reviews
              </span>
            )}
          </div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-4">Your Review</h3>

                {/* Star Input */}
                <div className="mb-4">
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rating *</p>
                  <StarInput value={reviewForm.rating} onChange={(val) => setReviewForm({ ...reviewForm, rating: val })} />
                </div>

                {/* Comment Input */}
                <div className="mb-4">
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Comment *</p>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Share your experience with this lawyer..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-yellow-400 resize-none text-sm transition duration-300 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                  />
                </div>

                {/* Error / Success */}
                {reviewError && <p className="text-red-400 text-sm mb-3">⚠️ {reviewError}</p>}
                {reviewSuccess && <p className="text-green-400 text-sm mb-3">✅ {reviewSuccess}</p>}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition duration-300 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          {reviewsLoading ? (
            <p className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">⭐</p>
              <p className={`font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No reviews yet</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Be the first to review this lawyer!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold flex-shrink-0">
                        {review.client_name ? review.client_name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="font-bold">{review.client_name}</p>
                        <StarDisplay rating={review.rating} size="sm" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {/* Delete button — only for own review */}
                      {isLoggedInClient && currentUser.id === review.client_id && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-400 hover:text-red-300 text-xs transition duration-300"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={`mt-3 text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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