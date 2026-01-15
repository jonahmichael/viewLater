const express = require('express');
const router = express.Router();
const {
  getLinks,
  getTags,
  createLink,
  updateLink,
  deleteLink
} = require('../controllers/linkController');

// GET /api/links - Get all links (with optional filters)
router.get('/', getLinks);

// GET /api/links/tags - Get all unique tags
router.get('/tags', getTags);

// POST /api/links - Create new link
router.post('/', createLink);

// PUT /api/links/:id - Update link
router.put('/:id', updateLink);

// DELETE /api/links/:id - Delete link
router.delete('/:id', deleteLink);

module.exports = router;
