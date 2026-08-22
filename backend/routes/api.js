const express = require('express');
const router = express.Router();

const {
  getIdols,
  getIdolById,
  createIdol,
  updateIdol,
  deleteIdol,
  updateIdolStatus,
} = require('../controllers/idolController');

const {
  adminLogin,
  getDashboardStats,
  getSettings,
  updateSettings,
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth');
const { apiLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { upload, handleImageUpload } = require('../services/uploadService');

// APPLY GENERAL RATE LIMITER TO ALL API ENDPOINTS
router.use(apiLimiter);

// PUBLIC ROUTES
router.get('/idols', getIdols);
router.get('/idols/:id', getIdolById);
router.get('/settings', getSettings);

// ADMIN LOGIN ROUTE (STRICT RATE LIMITER)
router.post('/admin/login', loginLimiter, adminLogin);

// PROTECTED ADMIN ROUTES
router.get('/admin/dashboard', protect, getDashboardStats);
router.put('/admin/settings', protect, updateSettings);

router.post('/admin/idols', protect, createIdol);
router.put('/admin/idols/:id', protect, updateIdol);
router.delete('/api/admin/idols/:id', protect, deleteIdol); // Make sure this matches backend spec or can use router.delete('/admin/idols/:id')
router.delete('/admin/idols/:id', protect, deleteIdol); // Supporting both path conventions
router.patch('/admin/idols/:id/status', protect, updateIdolStatus);

// IMAGE UPLOAD ROUTE
router.post('/admin/upload', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const uploadPromises = req.files.map((file) => handleImageUpload(file));
    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      urls: imageUrls,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
});

module.exports = router;
