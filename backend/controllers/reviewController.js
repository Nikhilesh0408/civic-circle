const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET all reviews for a lawyer
const getReviews = async (req, res) => {
  const { lawyer_id } = req.params;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('lawyer_id', lawyer_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate average rating
    const avgRating = data.length > 0
      ? (data.reduce((sum, r) => sum + r.rating, 0) / data.length).toFixed(1)
      : 0;

    res.status(200).json({ reviews: data, avgRating, totalReviews: data.length });
  } catch (error) {
    console.error('❌ Get Reviews Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST a new review (only logged-in clients)
const addReview = async (req, res) => {
  const { lawyer_id } = req.params;
  const { client_id, client_name, rating, comment } = req.body;

  if (!client_id || !client_name || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  try {
    // Prevent duplicate reviews from same client for same lawyer
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('lawyer_id', lawyer_id)
      .eq('client_id', client_id)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this lawyer.' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ lawyer_id, client_id, client_name, rating, comment }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Review added successfully!', review: data[0] });
  } catch (error) {
    console.error('❌ Add Review Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a review (only the client who wrote it)
const deleteReview = async (req, res) => {
  const { review_id } = req.params;
  const { client_id } = req.body;

  try {
    const { data: review } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', review_id)
      .single();

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    if (review.client_id !== client_id) {
      return res.status(403).json({ message: 'You can only delete your own reviews.' });
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', review_id);

    if (error) throw error;

    res.status(200).json({ message: 'Review deleted successfully!' });
  } catch (error) {
    console.error('❌ Delete Review Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getReviews, addReview, deleteReview };