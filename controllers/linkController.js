const Link = require('../models/Link');

// Get all links
const getLinks = async (req, res) => {
  try {
    const { section, search, tags } = req.query;
    
    // Build query
    let query = {};
    
    if (section) {
      query.section = section;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    const links = await Link.find(query)
      .populate('section', 'name')
      .sort({ createdAt: -1 });
    
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all unique tags
const getTags = async (req, res) => {
  try {
    const links = await Link.find({});
    const tags = [...new Set(links.flatMap(link => link.tags))];
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new link
const createLink = async (req, res) => {
  try {
    const { url, title, description, tags, section } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const link = await Link.create({
      url,
      title,
      description,
      tags: tags || [],
      section: section || null
    });

    const populatedLink = await Link.findById(link._id).populate('section', 'name');

    res.status(201).json(populatedLink);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update link
const updateLink = async (req, res) => {
  try {
    const { url, title, description, tags, section } = req.body;
    const { id } = req.params;

    const link = await Link.findById(id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (url) link.url = url;
    if (title !== undefined) link.title = title;
    if (description !== undefined) link.description = description;
    if (tags) link.tags = tags;
    if (section) link.section = section;

    await link.save();

    const populatedLink = await Link.findById(link._id).populate('section', 'name');

    res.json(populatedLink);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete link
const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findById(id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    await Link.deleteOne({ _id: id });

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLinks,
  getTags,
  createLink,
  updateLink,
  deleteLink
};
