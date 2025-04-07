const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const About = require('../models/About');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all team members
router.get('/', async (req, res) => {
  try {
    const teamMembers = await About.find().sort({ order: 1 });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single team member
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await About.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new team member
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, position, description, order } = req.body;
    const image = req.file ? req.file.path : '';

    const newTeamMember = new About({
      name,
      position,
      image,
      description,
      order: order || 0
    });

    await newTeamMember.save();
    res.status(201).json(newTeamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update team member
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, position, description, order } = req.body;
    const updateData = {
      name,
      position,
      description,
      order: order || 0
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedTeamMember = await About.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTeamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(updatedTeamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete team member
router.delete('/:id', async (req, res) => {
  try {
    const deletedTeamMember = await About.findByIdAndDelete(req.params.id);
    if (!deletedTeamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 