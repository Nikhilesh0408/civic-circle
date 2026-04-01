const express = require('express');
const router = express.Router();
const { registerClient, registerAdvisor, login } = require('../controllers/authController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

// Multer storage for mixed uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'profile_photo') {
      return { folder: 'civic-circle/photos', allowed_formats: ['jpg', 'jpeg', 'png'] };
    } else {
      return { folder: 'civic-circle/documents', allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'] };
    }
  },
});

const upload = multer({ storage });

// Routes
router.post('/register/client', registerClient);
router.post('/register/advisor', upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'bar_certificate', maxCount: 1 }
]), registerAdvisor);
router.post('/login', login);

module.exports = router;