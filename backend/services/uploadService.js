const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');

// Configure Cloudinary if credentials are provided
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/i;
  const ext = allowedTypes.test(path.extname(file.originalname));
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG and WEBP files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// Helper function to compress and convert local file to WebP
const compressLocalToWebp = async (file) => {
  try {
    const webpFilename = path.basename(file.path, path.extname(file.path)) + '.webp';
    const webpPath = path.join(path.dirname(file.path), webpFilename);

    await sharp(file.path)
      .resize({ width: 1000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpPath);

    // Delete original file to save space
    try {
      fs.unlinkSync(file.path);
    } catch (unlinkErr) {
      console.error('Failed to delete original raw file:', unlinkErr);
    }

    return `/uploads/${webpFilename}`;
  } catch (err) {
    console.error('Local WebP compression failed, returning original path:', err);
    return `/uploads/${path.basename(file.path)}`;
  }
};

// Upload processor that uploads to Cloudinary or falls back to local storage URL
const handleImageUpload = async (file) => {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'ganesha_idols',
        format: 'webp',
        transformation: [{ width: 1000, crop: 'limit', quality: 'auto' }],
      });
      // Remove local copy after successful Cloudinary upload
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Failed to delete temporary local file:', err);
      }
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error, using local storage fallback:', error);
      return await compressLocalToWebp(file);
    }
  } else {
    return await compressLocalToWebp(file);
  }
};

module.exports = {
  upload,
  handleImageUpload,
};
