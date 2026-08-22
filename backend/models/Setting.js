const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: 'Sri Vinayaka Murti Kala Kendra',
    },
    whatsappNumber: {
      type: String,
      default: '919876543210',
    },
    phoneNumber: {
      type: String,
      default: '9876543210',
    },
    address: {
      type: String,
      default: '123 Main Road, Banahatti, Karnataka, India',
    },
    businessHours: {
      type: String,
      default: '9:00 AM - 9:00 PM',
    },
    mapsEmbedLink: {
      type: String,
      default: '',
    },
    pickupInfo: {
      type: String,
      default: 'Please visit our workshop to collect your booking. Bring a soft cushion or box for safe transport.',
    },
    deliveryInfo: {
      type: String,
      default: 'Local home delivery can be arranged upon request. Standard charges apply based on distance.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
