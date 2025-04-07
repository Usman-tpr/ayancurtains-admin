const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Curtain = require('../models/Curtain');

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

// Create new curtain
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? req.file.path : '';

    const newCurtain = new Curtain({
      title,
      description,
      image,
      price,
      category
    });

    await newCurtain.save();
    res.status(201).json(newCurtain);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all curtains
router.get('/', async (req, res) => {
  try {
    const curtains = await Curtain.find();
    res.json(curtains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single curtain
router.get('/:id', async (req, res) => {
  try {
    const curtain = await Curtain.findById(req.params.id);
    if (!curtain) {
      return res.status(404).json({ message: 'Curtain not found' });
    }
    res.json(curtain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update curtain
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const updateData = {
      title,
      description,
      price,
      category
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedCurtain = await Curtain.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCurtain) {
      return res.status(404).json({ message: 'Curtain not found' });
    }
    res.json(updatedCurtain);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete curtain
router.delete('/:id', async (req, res) => {
  try {
    const deletedCurtain = await Curtain.findByIdAndDelete(req.params.id);
    if (!deletedCurtain) {
      return res.status(404).json({ message: 'Curtain not found' });
    }
    res.json({ message: 'Curtain deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 