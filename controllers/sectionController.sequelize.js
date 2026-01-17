const { Section, Link } = require('../models/index.sequelize');
const { Op } = require('sequelize');

// Get all sections
const getSections = async (req, res) => {
  try {
    const sections = await Section.findAll({
      include: [
        {
          model: Link,
          as: 'links',
          attributes: ['id']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    // Transform to include link count
    const sectionsWithCount = sections.map(section => ({
      ...section.toJSON(),
      linkCount: section.links ? section.links.length : 0
    }));

    res.json(sectionsWithCount);
  } catch (error) {
    console.error('Error getting sections:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new section
const createSection = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Section name is required' });
    }

    const section = await Section.create({
      name,
      description: description || null,
      color: color || '#6366f1',
      icon: icon || null
    });

    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single section
const getSectionById = async (req, res) => {
  try {
    const section = await Section.findByPk(req.params.id, {
      include: [
        {
          model: Link,
          as: 'links'
        }
      ]
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    console.error('Error getting section:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update section
const updateSection = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    
    const section = await Section.findByPk(req.params.id);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    await section.update({
      name: name || section.name,
      description: description !== undefined ? description : section.description,
      color: color || section.color,
      icon: icon !== undefined ? icon : section.icon
    });

    res.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete section
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findByPk(req.params.id);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Links will be set to null (sectionId) due to SET NULL constraint
    await section.destroy();
    
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSections,
  createSection,
  getSectionById,
  updateSection,
  deleteSection
};
