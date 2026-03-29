const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const lawyerRoutes = require('./routes/lawyerRoutes');
app.use('/api/lawyers', lawyerRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Civic Circle API is running 🚀' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
  console.log('✅ Supabase Connected Successfully!');
});