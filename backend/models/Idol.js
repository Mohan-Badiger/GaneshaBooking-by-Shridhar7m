const mongoose = require('mongoose');

const idolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      required: [true, 'Please add a model code'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      default: 'This beautiful Ganesha idol is handcrafted from pure, eco-friendly clay (Shadu Mati). Hand-painted with devotion by local traditional artisans using non-toxic organic colors, it features intricate details. It is completely biodegradable and designed to dissolve easily in a bucket of water at home, leaving zero environmental footprint.',
    },
    height: {
      type: Number, // In feet, e.g. 3.5
      required: [true, 'Please add height in feet'],
    },
    width: {
      type: Number, // In feet
    },
    material: {
      type: String,
      required: [true, 'Please specify the material used'],
      default: 'Eco-friendly Clay (Shadu Mati)',
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number'],
    },
    images: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name before saving if slug is not provided
idolSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Idol', idolSchema);
