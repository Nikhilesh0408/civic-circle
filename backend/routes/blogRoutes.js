const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog } = require('../controllers/blogController');

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/create', createBlog);

module.exports = router;