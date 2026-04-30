const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials!' });
    }

    const token = jwt.sign(
      { role: 'admin', email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'Admin login successful!', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL LAWYERS
const getAllLawyers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('legal_advisors')
      .select('id, name, email, phone, specialization, city, experience_duration, languages_known, is_verified, profile_photo, bar_certificate, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ lawyers: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// VERIFY LAWYER
const verifyLawyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    const { data, error } = await supabase
      .from('legal_advisors')
      .update({ is_verified })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.status(200).json({
      message: is_verified ? 'Lawyer verified successfully!' : 'Lawyer verification removed!',
      lawyer: data[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL CLIENTS
const getAllClients = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, email, phone, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ clients: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ bookings: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ blogs: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Blog deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id, type } = req.params;
    const table = type === 'client' ? 'clients' : 'legal_advisors';

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { adminLogin, getAllLawyers, verifyLawyer, getAllClients, getAllBookings, getAllBlogs, deleteBlog, deleteUser };