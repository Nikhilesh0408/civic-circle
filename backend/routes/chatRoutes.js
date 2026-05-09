const express = require('express');
const router = express.Router();
const multer = require('multer');
const { chat, analyzeDocument } = require('../controllers/chatController');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed!'));
    }
  }
});

router.post('/', chat);
router.post('/analyze-document', upload.single('document'), analyzeDocument);

module.exports = router;