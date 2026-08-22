const mongoose = require('mongoose');

// Disable query buffering globally so queries fail fast if the connection is down
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB Connection Error: MONGODB_URI environment variable is not defined!');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail connection attempt after 5 seconds
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not call process.exit(1) in serverless environments to prevent function invocation crashes
  }
};

module.exports = connectDB;
