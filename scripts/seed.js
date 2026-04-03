const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Sighting = require('../models/Sighting');

dotenv.config();

const speciesData = [
  { species: 'House Sparrow', category: 'Bird' },
  { species: 'Rock Pigeon', category: 'Bird' },
  { species: 'Indian Myna', category: 'Bird' },
  { species: 'Black Kite', category: 'Bird' },
  { species: 'Rose-ringed Parakeet', category: 'Bird' },
  { species: 'Barn Owl', category: 'Bird' },
  { species: 'Indian Peafowl', category: 'Bird' },
  { species: 'Spotted Owlet', category: 'Bird' },
  { species: 'Rhesus Macaque', category: 'Mammal' },
  { species: 'Indian Palm Squirrel', category: 'Mammal' },
  { species: 'Indian Flying Fox', category: 'Mammal' },
  { species: 'Mongoose', category: 'Mammal' },
  { species: 'Nilgai', category: 'Mammal' },
  { species: 'Garden Lizard', category: 'Reptile' },
  { species: 'Indian Cobra', category: 'Reptile' },
  { species: 'Monitor Lizard', category: 'Reptile' },
  { species: 'Common Frog', category: 'Amphibian' },
  { species: 'Indian Bullfrog', category: 'Amphibian' },
  { species: 'Monarch Butterfly', category: 'Insect' },
  { species: 'Dragonfly', category: 'Insect' },
  { species: 'Honeybee', category: 'Insect' },
  { species: 'Ladybug', category: 'Insect' },
  { species: 'Catfish', category: 'Fish' },
  { species: 'Tilapia', category: 'Fish' },
];

const neighborhoods = [
  'Central Park District', 'Riverside Colony', 'Green Valley',
  'Lakeside Gardens', 'Old Town', 'University Area',
  'Industrial Zone', 'Tech Hub', 'Heritage Quarter',
  'Forest Edge', 'Wetland Reserve', 'Hilltop View',
];

// Sample city coordinates (Delhi NCR area spread)
const baseCoords = [
  [77.2090, 28.6139], [77.2273, 28.6353], [77.1855, 28.5933],
  [77.2507, 28.6129], [77.1704, 28.6304], [77.2885, 28.5445],
  [77.3201, 28.5700], [77.1500, 28.5800], [77.2100, 28.6500],
  [77.1950, 28.6050], [77.2650, 28.5850], [77.2350, 28.6250],
];

const samplePhotos = [
  { url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800', publicId: 'seed_bird_1' },
  { url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800', publicId: 'seed_mammal_1' },
  { url: 'https://images.unsplash.com/photo-1557401620-67270b4bb2f7?w=800', publicId: 'seed_reptile_1' },
  { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', publicId: 'seed_frog_1' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800', publicId: 'seed_insect_1' },
  { url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800', publicId: 'seed_bird_2' },
  { url: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800', publicId: 'seed_reptile_2' },
  { url: 'https://images.unsplash.com/photo-1535338454528-1b5c8e6fa8c3?w=800', publicId: 'seed_mammal_2' },
];

const descriptions = [
  'Spotted near the park entrance during morning walk',
  'Found resting on a tree branch in the garden',
  'Seen crossing the road near the lake',
  'Photographed near the bushes along the trail',
  'Observed feeding in the community garden',
  'Noticed nesting under the bridge',
  'Caught sunbathing on a rock near the pond',
  'Discovered hiding in the undergrowth',
  'Seen flying over the residential area at dusk',
  'Found near the drainage canal during rain',
];

const randomDate = (monthsBack) => {
  const d = new Date();
  d.setMonth(d.getMonth() - Math.floor(Math.random() * monthsBack));
  d.setDate(Math.floor(Math.random() * 28) + 1);
  d.setHours(Math.floor(Math.random() * 12) + 6);
  return d;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Sighting.deleteMany({});

    // Create demo users
    const users = await User.create([
      { username: 'naturelover', email: 'nature@demo.com', password: 'demo1234', bio: '🌿 Urban naturalist and bird watcher' },
      { username: 'cityscientist', email: 'scientist@demo.com', password: 'demo1234', bio: '🔬 Citizen scientist exploring urban wildlife' },
      { username: 'wildlifewatcher', email: 'watcher@demo.com', password: 'demo1234', bio: '📸 Wildlife photographer in the city' },
    ]);

    console.log(`✅ Created ${users.length} demo users`);

    // Create 50 sample sightings
    const sightings = [];
    for (let i = 0; i < 50; i++) {
      const speciesInfo = speciesData[Math.floor(Math.random() * speciesData.length)];
      const coordBase = baseCoords[Math.floor(Math.random() * baseCoords.length)];
      const user = users[Math.floor(Math.random() * users.length)];

      sightings.push({
        user: user._id,
        photo: samplePhotos[Math.floor(Math.random() * samplePhotos.length)],
        species: speciesInfo.species,
        category: speciesInfo.category,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        location: {
          type: 'Point',
          coordinates: [
            coordBase[0] + (Math.random() - 0.5) * 0.05,
            coordBase[1] + (Math.random() - 0.5) * 0.05,
          ],
        },
        neighborhood: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
        verified: Math.random() > 0.3,
        createdAt: randomDate(6),
      });
    }

    const created = await Sighting.insertMany(sightings);
    console.log(`✅ Created ${created.length} sample sightings`);

    // Update user sighting counts
    for (const user of users) {
      const count = await Sighting.countDocuments({ user: user._id });
      await User.findByIdAndUpdate(user._id, { totalSightings: count });
    }

    console.log('🎉 Seed complete! Demo login: nature@demo.com / demo1234');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
