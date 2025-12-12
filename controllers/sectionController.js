const Section = require('../models/Section');

// Get all sections for logged-in user
const getSections = async (req, res) => {
  try {
    const sections = await Section.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new section
const createSection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Section name is required' });
    }

    const section = await Section.create({
      name,
      user: req.user.userId
    });

    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update section
const updateSection = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Section name is required' });
    }

    const section = await Section.findOne({ _id: id, user: req.user.userId });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.name = name;
    await section.save();

    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete section
const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findOne({ _id: id, user: req.user.userId });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    await Section.deleteOne({ _id: id });

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection
};
