const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET ALL LAWYERS with search & filter
const getLawyers = async (req, res) => {
  try {
    const { specialization, city, languages_known, search } = req.query;

    let query = supabase
      .from('legal_advisors')
      .select('id, name, email, phone, specialization, city, bio, experience_duration, languages_known, is_verified, profile_photo, bar_certificate');

    if (specialization) {
      query = query.ilike('specialization', `%${specialization}%`);
    }
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }
    if (languages_known) {
      query = query.ilike('languages_known', `%${languages_known}%`);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,specialization.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json({ lawyers: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET SINGLE LAWYER BY ID
const getLawyerById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('legal_advisors')
      .select('id, name, email, phone, specialization, city, bio, experience_duration, languages_known, is_verified, profile_photo, bar_certificate')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Lawyer not found!' });

    res.status(200).json({ lawyer: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getLawyers, getLawyerById };