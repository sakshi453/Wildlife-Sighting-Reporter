const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  photo: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  species: {
    type: String,
    required: [true, 'Species name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Mammal', 'Bird', 'Reptile', 'Amphibian', 'Insect', 'Fish', 'Other'],
  },
  description: {
    type: String,
    default: '',
    maxlength: 500,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  neighborhood: {
    type: String,
    default: 'Unknown',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

// GeoJSON 2dsphere index for geospatial queries
sightingSchema.index({ location: '2dsphere' });
sightingSchema.index({ category: 1, createdAt: -1 });
sightingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Sighting', sightingSchema);
