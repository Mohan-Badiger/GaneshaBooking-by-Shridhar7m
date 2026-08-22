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

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Turn off CSP for dev convenience with images, but keep other protection
    crossOriginEmbedderPolicy: false,
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
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploads static folder with caching (30 days)
app.use('/uploads', express.static(uploadDir, { maxAge: '30d' }));

// Mount REST APIs
app.use('/api', apiRoutes);

// Fallback error handlers
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    // Do not leak stack trace in production env
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist'), { maxAge: '1d', etag: true }));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Ganesha Booking Business API is running successfully.');
  });
}

// Start Server
const PORT = process.env.PORT || 5000;

// Connect DB first then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
