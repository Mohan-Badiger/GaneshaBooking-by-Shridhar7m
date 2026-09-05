const Idol = require('../models/Idol');
const Media = require('../models/Media');
const fs = require('fs');
const path = require('path');

const deleteLocalOrDbImage = async (img) => {
  if (img && img.startsWith('/uploads/')) {
    const filename = path.basename(img);
    try {
      await Media.deleteOne({ filename });
    } catch (dbErr) {
      console.error(`Failed to delete media ${filename} from DB:`, dbErr);
    }
    const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
    const uploadDir = isVercel ? '/tmp' : path.join(__dirname, '../uploads');
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete local file: ${filePath}`, err);
      }
    }
  }
};

// @desc    Get all idols (public)
// @route   GET /api/idols
const getIdols = async (req, res) => {
  try {
    const { search, availability, sort, featured, page = 1, limit = 12 } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { material: { $regex: search, $options: 'i' } }
      ];
    }

    // Availability filter
    if (availability === 'true') {
      query.availability = true;
    } else if (availability === 'false') {
      query.availability = false;
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Sort definition
    let sortOption = { displayOrder: 1, createdAt: -1 };
    if (sort === 'priceAsc') {
      sortOption = { price: 1 };
    } else if (sort === 'priceDesc') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Idol.countDocuments(query);
    const idols = await Idol.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: idols.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: idols,
    });
  } catch (error) {
    console.error('Error fetching idols:', error);
    res.status(500).json({ success: false, message: 'Server Error loading idols' });
  }
};

// @desc    Get single idol (public)
// @route   GET /api/idols/:id
const getIdolById = async (req, res) => {
  try {
    const { id } = req.params;
    let idol;

    // Check if valid ObjectId, otherwise query by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      idol = await Idol.findById(id);
    } else {
      idol = await Idol.findOne({ slug: id });
    }

    if (!idol) {
      return res.status(404).json({ success: false, message: 'Ganesha idol not found' });
    }

    res.status(200).json({ success: true, data: idol });
  } catch (error) {
    console.error('Error fetching idol details:', error);
    res.status(500).json({ success: false, message: 'Server Error loading idol details' });
  }
};

// @desc    Create Ganesha Idol (admin)
// @route   POST /api/admin/idols
const createIdol = async (req, res) => {
  try {
    const { name, description, height, width, material, price, images, features, availability, featured, displayOrder } = req.body;

    if (!name || !description || !height || !price) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Auto-generate unique 4-digit code starting from 0001
    const idols = await Idol.find({}, 'code');
    let maxVal = 0;
    idols.forEach((idol) => {
      const codeNum = parseInt(idol.code, 10);
      if (!isNaN(codeNum) && codeNum > maxVal) {
        maxVal = codeNum;
      }
    });
    const generatedCode = String(maxVal + 1).padStart(4, '0');

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Check slug uniqueness
    const slugExists = await Idol.findOne({ slug });
    let finalSlug = slug;
    if (slugExists) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const newIdol = await Idol.create({
      name,
      code: generatedCode,
      slug: finalSlug,
      description,
      height,
      width,
      material,
      price,
      images: images || [],
      features: features ? (Array.isArray(features) ? features : JSON.parse(features)) : [],
      availability: availability !== undefined ? availability : true,
      featured: featured !== undefined ? featured : false,
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({ success: true, data: newIdol });
  } catch (error) {
    console.error('Error creating idol:', error);
    res.status(500).json({ success: false, message: 'Server Error creating Ganesha idol' });
  }
};

// @desc    Update Ganesha Idol (admin)
// @route   PUT /api/admin/idols/:id
const updateIdol = async (req, res) => {
  try {
    const { id } = req.params;
    let idol = await Idol.findById(id);

    if (!idol) {
      return res.status(404).json({ success: false, message: 'Ganesha idol not found' });
    }

    const { name, description, height, width, material, price, images, features, availability, featured, displayOrder } = req.body;

    // Detect deleted images if they are stored locally and remove from DB and filesystem
    if (images && Array.isArray(images)) {
      const removedImages = idol.images.filter((img) => !images.includes(img));
      for (const img of removedImages) {
        await deleteLocalOrDbImage(img);
      }
    }

    // Update fields
    if (name) {
      idol.name = name;
      // Regenerate slug only if name changes
      idol.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) idol.description = description;
    if (height !== undefined) idol.height = height;
    if (width !== undefined) idol.width = width;
    if (material !== undefined) idol.material = material;
    if (price !== undefined) idol.price = price;
    if (images !== undefined) idol.images = images;
    if (features !== undefined) idol.features = Array.isArray(features) ? features : JSON.parse(features);
    if (availability !== undefined) idol.availability = availability;
    if (featured !== undefined) idol.featured = featured;
    if (displayOrder !== undefined) idol.displayOrder = displayOrder;

    const updatedIdol = await idol.save();
    res.status(200).json({ success: true, data: updatedIdol });
  } catch (error) {
    console.error('Error updating idol:', error);
    res.status(500).json({ success: false, message: 'Server Error updating Ganesha idol' });
  }
};

// @desc    Delete Ganesha Idol (admin)
// @route   DELETE /api/admin/idols/:id
const deleteIdol = async (req, res) => {
  try {
    const { id } = req.params;
    const idol = await Idol.findById(id);

    if (!idol) {
      return res.status(404).json({ success: false, message: 'Ganesha idol not found' });
    }

    // Remove associated media files from DB and filesystem
    for (const img of idol.images) {
      await deleteLocalOrDbImage(img);
    }

    await Idol.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Ganesha idol deleted successfully' });
  } catch (error) {
    console.error('Error deleting idol:', error);
    res.status(500).json({ success: false, message: 'Server Error deleting Ganesha idol' });
  }
};

// @desc    Patch Ganesha Idol Status (admin)
// @route   PATCH /api/admin/idols/:id/status
const updateIdolStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { availability, featured } = req.body;

    const idol = await Idol.findById(id);
    if (!idol) {
      return res.status(404).json({ success: false, message: 'Ganesha idol not found' });
    }

    if (availability !== undefined) idol.availability = availability;
    if (featured !== undefined) idol.featured = featured;

    await idol.save();
    res.status(200).json({ success: true, data: idol });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Server Error updating status' });
  }
};

// @desc    Get next available unique 4-digit code (admin)
// @route   GET /api/admin/idols/next-code
const getNextIdolCode = async (req, res) => {
  try {
    const idols = await Idol.find({}, 'code');
    let maxVal = 0;

    idols.forEach((idol) => {
      const codeNum = parseInt(idol.code, 10);
      if (!isNaN(codeNum) && codeNum > maxVal) {
        maxVal = codeNum;
      }
    });

    res.status(200).json({ success: true, nextCode: String(maxVal + 1).padStart(4, '0') });
  } catch (error) {
    console.error('Error fetching next code:', error);
    res.status(500).json({ success: false, message: 'Server Error calculating next code' });
  }
};

module.exports = {
  getIdols,
  getIdolById,
  createIdol,
  updateIdol,
  deleteIdol,
  updateIdolStatus,
  getNextIdolCode,
};
