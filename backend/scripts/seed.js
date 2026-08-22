require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('DNS server override failed, using default system resolver:', err);
}

const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Idol = require('../models/Idol');
const Setting = require('../models/Setting');

const adminSeed = {
  name: 'Store Owner',
  email: 'admin@ganeshabooking.com',
  passwordHash: 'admin123', // Will be hashed automatically by pre-save hook
};

const settingsSeed = {
  businessName: 'Sri Vinayaka Murti Kala Kendra',
  whatsappNumber: '919876543210',
  phoneNumber: '9876543210',
  address: '123 Ganesha Lane, Craft Town, Banahatti 587311, Karnataka',
  businessHours: '8:00 AM - 10:00 PM',
  mapsEmbedLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15234.331289196884!2d75.20455589999998!3d16.3852156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc6c9e0d164104f%3A0xc4eb076c8c440c9d!2sBanahatti%2C%20Karnataka%20587311!5e0!3m2!1sen!2sin!4v1724300000000!5m2!1sen!2sin',
  pickupInfo: 'Pickups are scheduled daily from our main workshop. Please bring a soft, cushioned sheet or cardboard box to transport your Ganesha safely.',
  deliveryInfo: 'Local home delivery available within a 15km radius. A standard shipping fee will be charged based on the distance at pickup.',
};

const idolsSeed = [
  {
    name: 'Royal Maharaja Ganesha',
    slug: 'royal-maharaja-ganesha',
    description: 'This premium, majestically seated Ganesha idol is handcrafted from pure eco-friendly shadu clay. Features high-quality organic colors and a beautiful traditional crown with golden highlights.',
    height: 4.0,
    width: 2.5,
    material: 'Eco-friendly Clay (Shadu Mati)',
    price: 9500,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1626248962299-c8c3e06ea558?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['100% Biodegradable', 'Organic natural colors', 'Intricate ornaments details', 'Comes with durable wooden base'],
    availability: true,
    featured: true,
    displayOrder: 1,
  },
  {
    name: 'Dagdusheth Style Ganesha',
    slug: 'dagdusheth-style-ganesha',
    description: 'Inspired by the famous Dagdusheth Halwai Ganpati of Pune. Features beautiful clay crown, gold ornament replicas, and a deep reddish-orange traditional attire finish.',
    height: 3.5,
    width: 2.2,
    material: 'Eco-friendly Clay (Shadu Mati)',
    price: 7800,
    images: [
      'https://images.unsplash.com/photo-1567591414240-e2985172242b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Eco-friendly clay', 'Natural pigments', 'Classic Ganpati pose', 'Includes back arch decor'],
    availability: true,
    featured: true,
    displayOrder: 2,
  },
  {
    name: 'Eco clay Siddhivinayak',
    slug: 'eco-clay-siddhivinayak',
    description: 'Siddhivinayak style Ganesha with a tilted trunk to the right. Beautifully sculpted ears, sitting in a serene meditative posture. Ideal for home temples.',
    height: 2.5,
    width: 1.8,
    material: 'Eco-friendly Clay (Shadu Mati)',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1609137144813-7d72df34275f?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Right tilted trunk (Siddhivinayak)', 'Compact size for flats', 'Lightweight', 'Dissolves easily in bucket'],
    availability: true,
    featured: true,
    displayOrder: 3,
  },
  {
    name: 'Lalbaug Raja Replica',
    slug: 'lalbaug-raja-replica',
    description: 'Beautiful miniature replica of the world-famous Lalbaugcha Raja. Crafted out of paper pulp and organic shadu clay for an authentic look and quick eco dissolution.',
    height: 5.0,
    width: 3.0,
    material: 'Eco-friendly Clay & Paper Pulp Mix',
    price: 12500,
    images: [
      'https://images.unsplash.com/photo-1614082242765-7c98cdc0d2df?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590076215667-8737db2ef581?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Grand design', 'Stately posture', 'Vibrant watercolor finishes', 'Sturdy lightweight design'],
    availability: true,
    featured: true,
    displayOrder: 4,
  },
  {
    name: 'Bal Ganesha Idol',
    slug: 'bal-ganesha-idol',
    description: 'An extremely cute, child-like Ganesha idol playing with a modak. Ideal for families with small kids. Crafted with non-toxic chemical-free colors.',
    height: 1.5,
    width: 1.2,
    material: 'Eco-friendly Clay (Shadu Mati)',
    price: 2200,
    images: [
      'https://images.unsplash.com/photo-1554124490-c6504c3673c6?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Child friendly design', 'Safe natural colors', 'Perfect for small children', '100% non-toxic'],
    availability: true,
    featured: false,
    displayOrder: 5,
  },
  {
    name: 'Traditional Pagdi Ganesha',
    slug: 'traditional-pagdi-ganesha',
    description: 'Ganesha idol wearing a Maharashtrian traditional turban (Pagdi/Pheta). Features detailed hand-painted orange-and-cream colors and a blessing hand posture.',
    height: 3.0,
    width: 2.0,
    material: 'Eco-friendly Clay (Shadu Mati)',
    price: 6500,
    images: [
      'https://images.unsplash.com/photo-1609137149037-f81bd6702c2e?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Traditional Turban design', 'Warm pastel colors', 'Rich details', 'Auspicious sitting style'],
    availability: true,
    featured: false,
    displayOrder: 6,
  },
  {
    name: 'Ganesha on Lotus base',
    slug: 'ganesha-on-lotus-base',
    description: 'A serene and calm posture Ganesha sitting on a beautifully crafted pink lotus flower. Hand-carved details on the petals and crown.',
    height: 2.8,
    width: 2.0,
    material: 'Eco-friendly Clay (Shadu Mati)',
    price: 5500,
    images: [
      'https://images.unsplash.com/photo-1590076215667-8737db2ef581?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Lotus base', 'Pastel pink and gold tones', 'Eco-friendly colors', 'Smooth clay texture'],
    availability: true,
    featured: false,
    displayOrder: 7,
  },
  {
    name: 'Lord Ganesha in Dhyan Mudra',
    slug: 'lord-ganesha-in-dhyan-mudra',
    description: 'A beautiful idol of Ganesha closed-eyes sitting in the classic Dhyan (meditating) mudra posture. Provides a peaceful, divine presence to your home.',
    height: 3.2,
    width: 2.0,
    material: 'Eco-friendly Clay (Shadu Mati)',
    price: 7200,
    images: [
      'https://images.unsplash.com/photo-1626248962299-c8c3e06ea558?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Dhyan posture', 'Peaceful expression', 'Matte organic colors', 'Gold trim borders'],
    availability: false, // Out of Stock example
    featured: false,
    displayOrder: 8,
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database. Cleaning up old data...');

    // Delete existing
    await Admin.deleteMany({});
    await Setting.deleteMany({});
    await Idol.deleteMany({});

    console.log('Inserting seed records...');

    // Create Admin
    const admin = await Admin.create(adminSeed);
    console.log(`Admin account created successfully: ${admin.email}`);

    // Create Settings
    const settings = await Setting.create(settingsSeed);
    console.log(`Settings created successfully: ${settings.businessName}`);

    // Create Idols
    const idols = await Idol.insertMany(idolsSeed);
    console.log(`${idols.length} Ganesha idols seeded successfully.`);

    console.log('Seeding complete! Exiting...');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed:', error);
    process.exit(1);
  }
};

seedDatabase();
