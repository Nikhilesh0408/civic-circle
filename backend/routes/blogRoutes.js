const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog, likeBlog, addComment, getComments, deleteComment } = require('../controllers/blogController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'civic-circle/blogs',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/create', upload.single('blog_image'), createBlog);
router.post('/:id/like', likeBlog);
router.post('/:id/comment', addComment);
router.get('/:id/comments', getComments);
router.delete('/comment/:commentId', deleteComment);

module.exports = router;