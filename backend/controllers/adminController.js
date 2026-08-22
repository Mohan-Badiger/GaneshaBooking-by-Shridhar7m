const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Idol = require('../models/Idol');
const Setting = require('../models/Setting');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.status(200).json({
        success: true,
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalIdols = await Idol.countDocuments();
    const availableIdols = await Idol.countDocuments({ availability: true });
    const outOfStockIdols = await Idol.countDocuments({ availability: false });
    const featuredIdols = await Idol.countDocuments({ featured: true });

    res.status(200).json({
      success: true,
      stats: {
        total: totalIdols,
        available: availableIdols,
        outOfStock: outOfStockIdols,
        featured: featuredIdols,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error loading dashboard metrics' });
  }
};

// @desc    Get business settings (publicly accessible for configuration sync)
// @route   GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create defaults from environment variables if possible, or fallbacks
      settings = await Setting.create({
        businessName: process.env.BUSINESS_NAME || 'Sri Vinayaka Murti Kala Kendra',
        whatsappNumber: process.env.WHATSAPP_NUMBER || '919876543210',
        phoneNumber: process.env.PHONE_NUMBER || '9876543210',
        address: process.env.BUSINESS_ADDRESS || '123 Main Road, Banahatti, Karnataka, India',
        businessHours: process.env.BUSINESS_HOURS || '9:00 AM - 9:00 PM',
        mapsEmbedLink: process.env.MAPS_EMBED_LINK || '',
      });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving settings' });
  }
};

// @desc    Update business settings (admin only)
// @route   PUT /api/admin/settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    const updateData = req.body;

    if (!settings) {
      settings = new Setting(updateData);
    } else {
      Object.assign(settings, updateData);
    }

    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Server error updating business settings' });
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  getSettings,
  updateSettings,
};
