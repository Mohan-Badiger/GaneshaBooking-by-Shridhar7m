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
    const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
    const uploadDir = isVercel ? '/tmp' : path.join(__dirname, '../uploads');
    
    if (!isVercel && !fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch (err) {
        console.warn('Could not create uploads directory:', err.message);
      }
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

const Media = require('../models/Media');

// Helper function to compress and convert local file to WebP, saving to disk and MongoDB
const compressLocalToWebp = async (file) => {
  try {
    const webpFilename = path.basename(file.path, path.extname(file.path)) + '.webp';
    const webpPath = path.join(path.dirname(file.path), webpFilename);

    const webpBuffer = await sharp(file.path)
      .resize({ width: 1000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Write compressed copy to local cache directory
    try {
      await fs.promises.writeFile(webpPath, webpBuffer);
    } catch (writeErr) {
      console.warn('Could not write to local disk cache:', writeErr.message);
    }

    // Persist permanently in MongoDB Media collection
    try {
      await Media.findOneAndUpdate(
        { filename: webpFilename },
        {
          filename: webpFilename,
          data: webpBuffer,
          contentType: 'image/webp',
          size: webpBuffer.length,
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.error('Failed to persist image to MongoDB Media:', dbErr);
    }

    // Delete original file to save space
    try {
      fs.unlinkSync(file.path);
    } catch (unlinkErr) {
      console.error('Failed to delete original raw file:', unlinkErr);
    }

    return `/uploads/${webpFilename}`;
  } catch (err) {
    console.error('Local WebP compression failed, attempting raw storage fallback:', err);
    try {
      const rawFilename = path.basename(file.path);
      const rawBuffer = await fs.promises.readFile(file.path);
      await Media.findOneAndUpdate(
        { filename: rawFilename },
        {
          filename: rawFilename,
          data: rawBuffer,
          contentType: file.mimetype || 'image/jpeg',
          size: rawBuffer.length,
        },
        { upsert: true, new: true }
      );
      return `/uploads/${rawFilename}`;
    } catch (rawErr) {
      console.error('Failed fallback saving raw file:', rawErr);
      return `/uploads/${path.basename(file.path)}`;
    }
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
