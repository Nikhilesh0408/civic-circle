const { createClient } = require('@supabase/supabase-js');
const { cloudinary } = require('../config/cloudinary');
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
    const { title, content, author_name, author_id, author_role, category } = req.body;

    if (!title || !content || !author_name) {
      return res.status(400).json({ message: 'Title, content and author name are required!' });
    }

    let image_url = '';
    if (req.file) {
      image_url = req.file.path;
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, author_name, author_id, author_role, category, image_url, likes: 0 }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Blog created successfully!', blog: data[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LIKE BLOG
const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('likes')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from('blogs')
      .update({ likes: (blog.likes || 0) + 1 })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.status(200).json({ message: 'Blog liked!', likes: data[0].likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, author_name, author_id, author_role } = req.body;

    if (!comment || !author_name) {
      return res.status(400).json({ message: 'Comment and author name are required!' });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ blog_id: id, comment, author_name, author_id, author_role }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Comment added!', comment: data[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET COMMENTS
const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ comments: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { author_id } = req.body;

    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .single();

    if (fetchError) throw fetchError;

    if (comment.author_id !== parseInt(author_id)) {
      return res.status(403).json({ message: 'You can only delete your own comments!' });
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;

    res.status(200).json({ message: 'Comment deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getBlogs, getBlogById, createBlog, likeBlog, addComment, getComments, deleteComment };