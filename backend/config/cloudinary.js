const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for profile photos
const photoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'civic-circle/photos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Storage for documents
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'civic-circle/documents',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
  },
});

const uploadPhoto = multer({ storage: photoStorage });
const uploadDocument = multer({ storage: documentStorage });

module.exports = { cloudinary, uploadPhoto, uploadDocument };