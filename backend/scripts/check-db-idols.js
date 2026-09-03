require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('DNS server override failed, using default system resolver:', err);
}
const mongoose = require('mongoose');

const checkIdols = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not defined.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // Fetch Idols
    const Idol = mongoose.model('Idol', new mongoose.Schema({
      name: String,
      images: [String]
    }));

    const idols = await Idol.find({});
    console.log('--- Current Idols in DB ---');
    idols.forEach(idol => {
      console.log(`Name: ${idol.name}`);
      console.log(`Images:`, idol.images);
      console.log('---------------------------');
    });

  } catch (error) {
    console.error('Failed to query DB:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkIdols();
