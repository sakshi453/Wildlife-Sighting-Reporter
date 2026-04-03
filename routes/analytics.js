const express = require('express');
const router = express.Router();
const {
  getTopSpecies,
  getHealthCheck,
  getTrends,
  getHotspots,
} = require('../controllers/analyticsController');

router.get('/top-species', getTopSpecies);
router.get('/health-check', getHealthCheck);
router.get('/trends', getTrends);
router.get('/hotspots', getHotspots);

module.exports = router;
