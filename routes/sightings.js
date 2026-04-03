const express = require('express');
const router = express.Router();
const {
  createSighting,
  getSightings,
  getSighting,
  getUserSightings,
  deleteSighting,
  toggleLike,
} = require('../controllers/sightingController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getSightings)
  .post(protect, upload.single('photo'), createSighting);

router.get('/user/:userId', getUserSightings);

router.route('/:id')
  .get(getSighting)
  .delete(protect, deleteSighting);

router.put('/:id/like', protect, toggleLike);

module.exports = router;
