require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('DNS server override failed, using default system resolver:', err);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const connectDB = async () => {
  const dbConnector = require('./config/db');
  await dbConnector();
};

const apiRoutes = require('./routes/api');

const app = express();

// Trust first proxy (Vercel) for express-rate-limit to identify client IPs
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Turn off CSP for dev convenience with images, but keep other protection
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin loading of static uploads
  })
);

// CORS Config
app.use(
  cors({
    origin: '*', // Allow all for convenience, but can narrow down in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// JSON and URL parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
const uploadDir = isVercel ? '/tmp' : path.join(__dirname, 'uploads');
try {
  if (!isVercel && !fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create uploads directory (might be read-only file system):', err.message);
}

// Request logging & Vercel URL normalization middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '') || '/';
  }
  console.log(`[${req.method}] ${req.url} (original: ${req.originalUrl})`);
  next();
});

// Import Media model for persistent image fallback
const Media = require('./models/Media');
const fallbackPlaceholderPath = path.join(__dirname, '../frontend/public/artisan_clay_ganesha.webp');

// Serve uploads static folder with caching (30 days) if file exists on disk
app.use('/uploads', express.static(uploadDir, { maxAge: '30d' }));

// Persistent image handler for files that were lost from ephemeral disk /tmp
const servePersistentMedia = async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const localFilePath = path.join(uploadDir, filename);

    if (fs.existsSync(localFilePath)) {
      return res.sendFile(localFilePath);
    }

    const media = await Media.findOne({ filename });
    if (media && media.data) {
      // Re-populate disk cache if possible
      try {
        fs.writeFileSync(localFilePath, media.data);
      } catch (cacheErr) {
        // Non-critical if read-only
      }

      res.set('Content-Type', media.contentType || 'image/webp');
      res.set('Cache-Control', 'public, max-age=2592000, immutable');
      return res.send(media.data);
    }

    // If not found in DB or disk, serve high quality default placeholder to avoid broken image / alt text
    if (fs.existsSync(fallbackPlaceholderPath)) {
      res.set('Content-Type', 'image/webp');
      res.set('Cache-Control', 'public, max-age=86400');
      return res.sendFile(fallbackPlaceholderPath);
    }

    return res.status(404).json({ success: false, message: 'Image not found' });
  } catch (err) {
    console.error('Error retrieving persistent media from MongoDB:', err);
    return res.status(500).json({ success: false, message: 'Error loading image' });
  }
};

app.get('/uploads/:filename', servePersistentMedia);
app.get('/api/uploads/:filename', servePersistentMedia);

// Health check endpoints for root and /api
app.get('/', (req, res, next) => {
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendDistPath)) {
    return res.sendFile(path.resolve(frontendDistPath, 'index.html'));
  }
  res.status(200).json({
    success: true,
    message: 'Ganesha Booking Business API is running successfully',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ganesha Booking REST API is active',
    endpoints: {
      idols: '/api/idols',
      settings: '/api/settings',
      adminLogin: '/api/admin/login'
    }
  });
});

// Mount REST APIs under /api and root / (to support both direct and proxy requests)
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Fallback error handlers
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});

// Serve frontend build in production if the folder exists, otherwise return clean 404
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath, { maxAge: '1d', etag: true }));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl || req.url} not found on this server.`
    });
  });
}

// Start Server
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Export app for serverless deployments (e.g. Vercel)
module.exports = app;

// Only start the listener if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}
