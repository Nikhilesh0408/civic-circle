const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET ALL BLOGS
const getBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    let query = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json({ blogs: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET SINGLE BLOG
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Blog not found!' });

    res.status(200).json({ blog: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    const { title, content, author_name, author_id, author_role, category, image_url } = req.body;

    if (!title || !content || !author_name) {
      return res.status(400).json({ message: 'Title, content and author name are required!' });
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, author_name, author_id, author_role, category, image_url }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Blog created successfully!', blog: data[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getBlogs, getBlogById, createBlog };