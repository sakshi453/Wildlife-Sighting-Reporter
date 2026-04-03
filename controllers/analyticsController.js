const Sighting = require('../models/Sighting');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

// @desc    Get top observed species
// @route   GET /api/analytics/top-species
exports.getTopSpecies = async (req, res) => {
  try {
    const { months = 1 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const topSpecies = await Sighting.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: { species: '$species', category: '$category' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, species: '$_id.species', category: '$_id.category', count: 1 } },
    ]);

    res.json(topSpecies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get biodiversity health check
// @route   GET /api/analytics/health-check
exports.getHealthCheck = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Current month stats
    const [currentStats] = await Sighting.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      {
        $group: {
          _id: null,
          totalSightings: { $sum: 1 },
          uniqueSpecies: { $addToSet: '$species' },
          categories: { $addToSet: '$category' },
        },
      },
      {
        $project: {
          totalSightings: 1,
          uniqueSpecies: { $size: '$uniqueSpecies' },
          uniqueCategories: { $size: '$categories' },
        },
      },
    ]);

    // Last month stats for comparison
    const [lastMonthStats] = await Sighting.aggregate([
      { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } } },
      {
        $group: {
          _id: null,
          totalSightings: { $sum: 1 },
          uniqueSpecies: { $addToSet: '$species' },
        },
      },
      {
        $project: {
          totalSightings: 1,
          uniqueSpecies: { $size: '$uniqueSpecies' },
        },
      },
    ]);

    // Category breakdown
    const categoryBreakdown = await Sighting.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, category: '$_id', count: 1 } },
    ]);

    const current = currentStats || { totalSightings: 0, uniqueSpecies: 0, uniqueCategories: 0 };
    const last = lastMonthStats || { totalSightings: 0, uniqueSpecies: 0 };

    const biodiversityScore = current.totalSightings > 0
      ? Math.round((current.uniqueSpecies / current.totalSightings) * 100)
      : 0;

    res.json({
      currentMonth: {
        ...current,
        biodiversityScore,
      },
      lastMonth: last,
      categoryBreakdown,
      trend: {
        sightingChange: current.totalSightings - last.totalSightings,
        speciesChange: current.uniqueSpecies - last.uniqueSpecies,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly trends (timeseries)
// @route   GET /api/analytics/trends
exports.getTrends = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const trends = await Sighting.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSightings: { $sum: 1 },
          uniqueSpecies: { $addToSet: '$species' },
        },
      },
      {
        $project: {
          _id: 0,
          period: {
            $concat: [
              { $toString: '$_id.year' }, '-',
              { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] },
            ],
          },
          totalSightings: 1,
          uniqueSpecies: { $size: '$uniqueSpecies' },
        },
      },
      { $sort: { period: 1 } },
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get neighborhood hotspots
// @route   GET /api/analytics/hotspots
exports.getHotspots = async (req, res) => {
  try {
    const hotspots = await Sighting.aggregate([
      { $group: { _id: '$neighborhood', count: { $sum: 1 }, species: { $addToSet: '$species' } } },
      { $project: { _id: 0, neighborhood: '$_id', count: 1, speciesCount: { $size: '$species' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json(hotspots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
