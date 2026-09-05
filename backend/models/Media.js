const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      unique: true,
      index: true,
      trim: true,
    },
    data: {
      type: Buffer,
      required: [true, 'Image binary data is required'],
    },
    contentType: {
      type: String,
      default: 'image/webp',
    },
    size: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Media', mediaSchema);
