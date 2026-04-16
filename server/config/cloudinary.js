const dotenv = require('dotenv');
dotenv.config();                    // ← add this line

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add this to verify keys are loading
console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

// Configure Storage for Resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'job-portal/resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw'
  }
});

// Configure Storage for Profile Photos
const photoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'job-portal/photos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image'
  }
});

// Create Upload Middleware
const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = { cloudinary, uploadResume, uploadPhoto };