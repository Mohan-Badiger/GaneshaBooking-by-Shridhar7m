require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Media = require('../models/Media');
const Idol = require('../models/Idol');

async function seedMedia() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for media seeding.');

  // Collect available local image sources
  const candidateFiles = [
    path.join(__dirname, '../uploads/1787395611186-832831431.webp'),
    path.join(__dirname, '../uploads/1787395633138-532038277.webp'),
    path.join(__dirname, '../../frontend/public/artisan_clay_ganesha.webp'),
    path.join(__dirname, '../../frontend/public/divine_ganesha_hero.webp'),
  ];

  const availableBuffers = [];
  for (const fp of candidateFiles) {
    if (fs.existsSync(fp)) {
      const data = fs.readFileSync(fp);
      const filename = path.basename(fp);
      availableBuffers.push({ filename, data });
      await Media.findOneAndUpdate(
        { filename },
        { filename, data, contentType: 'image/webp', size: data.length },
        { upsert: true, new: true }
      );
      console.log(`Seeded media: ${filename} (${data.length} bytes)`);
    }
  }

  if (availableBuffers.length === 0) {
    console.warn('No local candidate images found to seed.');
    process.exit(0);
  }

  // Check existing idols and make sure all their image URLs have a corresponding Media record
  const idols = await Idol.find({});
  console.log(`Found ${idols.length} idols. Ensuring media persistence...`);

  let bufferIndex = 0;
  for (const idol of idols) {
    if (idol.images && idol.images.length > 0) {
      for (const imgUrl of idol.images) {
        if (imgUrl.startsWith('/uploads/')) {
          const filename = path.basename(imgUrl);
          const existingMedia = await Media.findOne({ filename });
          if (!existingMedia) {
            // Assign one of the valid real Ganesha idol images under this filename!
            const sample = availableBuffers[bufferIndex % availableBuffers.length];
            bufferIndex++;
            await Media.create({
              filename,
              data: sample.data,
              contentType: 'image/webp',
              size: sample.data.length,
            });
            console.log(`Restored missing image for idol "${idol.name}": ${filename}`);
          }
        }
      }
    }
  }

  console.log('Media seeding and restoration complete!');
  process.exit(0);
}

seedMedia().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
