const mongoose = require('mongoose');
const Sighting = require('../models/Sighting');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

/**
 * Analytics Engine - Biodiversity Health Check Generator
 * Runs via node-cron daily or can be triggered manually.
 * Aggregates monthly data into AnalyticsSnapshot documents.
 */
const runAnalyticsEngine = async () => {
  try {
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log(`🔬 Running analytics engine for period: ${period}`);

    // Total sightings this month
    const totalSightings = await Sighting.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Unique species
    const uniqueSpeciesArr = await Sighting.distinct('species', { createdAt: { $gte: startOfMonth } });
    const uniqueSpecies = uniqueSpeciesArr.length;

    // Biodiversity score
    const biodiversityScore = totalSightings > 0
      ? Math.round((uniqueSpecies / totalSightings) * 100)
      : 0;

    // Top species
    const topSpecies = await Sighting.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: { species: '$species', category: '$category' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, species: '$_id.species', category: '$_id.category', count: 1 } },
    ]);

    // Neighborhood hotspots
    const neighborhoodHotspots = await Sighting.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: '$neighborhood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, neighborhood: '$_id', count: 1 } },
    ]);

    // Category breakdown
    const categoryBreakdown = await Sighting.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, category: '$_id', count: 1 } },
    ]);

    // Upsert the snapshot
    await AnalyticsSnapshot.findOneAndUpdate(
      { period },
      {
        period,
        totalSightings,
        uniqueSpecies,
        biodiversityScore,
        topSpecies,
        neighborhoodHotspots,
        categoryBreakdown,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Analytics snapshot saved for ${period}: ${totalSightings} sightings, ${uniqueSpecies} species, score: ${biodiversityScore}`);
  } catch (error) {
    console.error('❌ Analytics engine error:', error.message);
  }
};

module.exports = runAnalyticsEngine;
