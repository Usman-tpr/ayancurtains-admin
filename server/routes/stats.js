const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const User = require('../models/User');
const Curtain = require('../models/Curtain');

// Get general statistics
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, todayVisits, totalCurtains] = await Promise.all([
      User.countDocuments(),
      Visit.findOne({ date: { $gte: today } }),
      Curtain.countDocuments(),
    ]);

    res.json({
      totalUsers,
      todayUsers: todayVisits?.count || 0,
      totalCurtains,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get visitor statistics for the last 7 days
router.get('/visitors', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const visits = await Visit.find({
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record a new visit
router.post('/record-visit', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visit = await Visit.findOne({ date: { $gte: today } });

    if (visit) {
      visit.count += 1;
      await visit.save();
    } else {
      await Visit.create({ date: today });
    }

    res.status(201).json({ message: 'Visit recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 