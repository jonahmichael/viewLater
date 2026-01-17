const { Link, Section, Tag } = require('../models/index.sequelize');
const { Op } = require('sequelize');

// Get all links with filtering
const getLinks = async (req, res) => {
  try {
    const { section, search, tags } = req.query;
    
    // Build where clause
    let whereClause = {};
    let includeClause = [
      {
        model: Section,
        as: 'section',
        attributes: ['id', 'name', 'color']
      },
      {
        model: Tag,
        as: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] } // Exclude junction table data
      }
    ];
    
    // Filter by section
    if (section && section !== 'unlisted') {
      whereClause.sectionId = section;
    } else if (section === 'unlisted') {
      whereClause.sectionId = null;
    }
    
    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { url: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      includeClause[1].where = {
        name: { [Op.in]: tagArray }
      };
      includeClause[1].required = true;
    }

    const links = await Link.findAll({
      where: whereClause,
      include: includeClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.json(links);
  } catch (error) {
    console.error('Error getting links:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all unique tags
const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });
    res.json(tags.map(tag => tag.name));
  } catch (error) {
    console.error('Error getting tags:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new link
const createLink = async (req, res) => {
  try {
    const { url, title, description, section, tags } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Create link
    const link = await Link.create({
      url,
      title: title || null,
      description: description || null,
      sectionId: section || null
    });

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagPromises = tags.map(async (tagName) => {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName.trim().toLowerCase() },
          defaults: { name: tagName.trim().toLowerCase() }
        });
        return tag;
      });
      
      const createdTags = await Promise.all(tagPromises);
      await link.setTags(createdTags);
    }

    // Fetch the complete link with associations
    const completedLink = await Link.findByPk(link.id, {
      include: [
        { model: Section, as: 'section' },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    res.status(201).json(completedLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single link
const getLinkById = async (req, res) => {
  try {
    const link = await Link.findByPk(req.params.id, {
      include: [
        { model: Section, as: 'section' },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.json(link);
  } catch (error) {
    console.error('Error getting link:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update link
const updateLink = async (req, res) => {
  try {
    const { url, title, description, section, tags } = req.body;
    
    const link = await Link.findByPk(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Update link fields
    await link.update({
      url: url || link.url,
      title: title !== undefined ? title : link.title,
      description: description !== undefined ? description : link.description,
      sectionId: section !== undefined ? (section || null) : link.sectionId
    });

    // Update tags if provided
    if (tags !== undefined) {
      if (Array.isArray(tags) && tags.length > 0) {
        const tagPromises = tags.map(async (tagName) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: tagName.trim().toLowerCase() },
            defaults: { name: tagName.trim().toLowerCase() }
          });
          return tag;
        });
        
        const updatedTags = await Promise.all(tagPromises);
        await link.setTags(updatedTags);
      } else {
        await link.setTags([]);
      }
    }

    // Fetch updated link with associations
    const updatedLink = await Link.findByPk(link.id, {
      include: [
        { model: Section, as: 'section' },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    res.json(updatedLink);
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete link
const deleteLink = async (req, res) => {
  try {
    const link = await Link.findByPk(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    await link.destroy();
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLinks,
  getTags,
  createLink,
  getLinkById,
  updateLink,
  deleteLink
};
