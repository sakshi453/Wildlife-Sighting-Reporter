const Sighting = require('../models/Sighting');
const User = require('../models/User');

// @desc    Create a new sighting
// @route   POST /api/sightings
exports.createSighting = async (req, res) => {
  try {
    const { species, category, description, latitude, longitude, neighborhood } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a photo' });
    }

    const sighting = await Sighting.create({
      user: req.user._id,
      photo: {
        url: req.file.path,
        publicId: req.file.filename,
      },
      species,
      category,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      neighborhood: neighborhood || 'Unknown',
    });

    // Increment user's total sightings
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalSightings: 1 } });

    const populated = await Sighting.findById(sighting._id).populate('user', 'username avatar');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sightings (with filters)
// @route   GET /api/sightings
exports.getSightings = async (req, res) => {
  try {
    const { category, species, neighborhood, startDate, endDate, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (species) filter.species = { $regex: species, $options: 'i' };
    if (neighborhood) filter.neighborhood = { $regex: neighborhood, $options: 'i' };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const sightings = await Sighting.find(filter)
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Sighting.countDocuments(filter);

    res.json({
      sightings,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single sighting
// @route   GET /api/sightings/:id
exports.getSighting = async (req, res) => {
  try {
    const sighting = await Sighting.findById(req.params.id).populate('user', 'username avatar bio');
    if (!sighting) {
      return res.status(404).json({ message: 'Sighting not found' });
    }
    res.json(sighting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sightings by user
// @route   GET /api/sightings/user/:userId
exports.getUserSightings = async (req, res) => {
  try {
    const sightings = await Sighting.find({ user: req.params.userId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(sightings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete sighting
// @route   DELETE /api/sightings/:id
exports.deleteSighting = async (req, res) => {
  try {
    const sighting = await Sighting.findById(req.params.id);
    if (!sighting) {
      return res.status(404).json({ message: 'Sighting not found' });
    }

    if (sighting.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this sighting' });
    }

    await sighting.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalSightings: -1 } });

    res.json({ message: 'Sighting removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/unlike sighting
// @route   PUT /api/sightings/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const sighting = await Sighting.findById(req.params.id);
    if (!sighting) {
      return res.status(404).json({ message: 'Sighting not found' });
    }

    const index = sighting.likes.indexOf(req.user._id);
    if (index === -1) {
      sighting.likes.push(req.user._id);
    } else {
      sighting.likes.splice(index, 1);
    }

    await sighting.save();
    res.json(sighting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
