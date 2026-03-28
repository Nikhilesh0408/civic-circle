const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// REGISTER CLIENT
const registerClient = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    // Check if email already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (existingClient) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to database
    const { data, error } = await supabase
      .from('clients')
      .insert([{ name, email, password: hashedPassword, phone }])
      .select();

    if (error) throw error;

    // Create token
    const token = jwt.sign(
      { id: data[0].id, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Client registered successfully!',
      token,
      user: { id: data[0].id, name: data[0].name, email: data[0].email, role: 'client' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// REGISTER LEGAL ADVISOR
const registerAdvisor = async (req, res) => {
  const { name, email, password, phone, specialization, city, bio, experience_duration, languages_known } = req.body;
  try {
    const { data: existingAdvisor } = await supabase
      .from('legal_advisors')
      .select('*')
      .eq('email', email)
      .single();

    if (existingAdvisor) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('legal_advisors')
      .insert([{ name, email, password: hashedPassword, phone, specialization, city, bio, experience_duration, languages_known }])
      .select();

    if (error) throw error;

    const token = jwt.sign(
      { id: data[0].id, role: 'advisor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Legal Advisor registered successfully!',
      token,
      user: { id: data[0].id, name: data[0].name, email: data[0].email, role: 'advisor' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN - FOR BOTH CLIENT AND ADVISOR
const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const table = role === 'client' ? 'clients' : 'legal_advisors';

    const { data: user, error } = await supabase
      .from(table)
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const token = jwt.sign(
      { id: user.id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerClient, registerAdvisor, login };