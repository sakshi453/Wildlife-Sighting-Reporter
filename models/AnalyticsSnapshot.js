const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true, // e.g., "2024-10"
  },
  totalSightings: Number,
  uniqueSpecies: Number,
  biodiversityScore: Number,
  topSpecies: [{
    species: String,
    category: String,
    count: Number,
  }],
  neighborhoodHotspots: [{
    neighborhood: String,
    count: Number,
  }],
  categoryBreakdown: [{
    category: String,
    count: Number,
  }],
}, { timestamps: true });

analyticsSnapshotSchema.index({ period: 1 }, { unique: true });

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
