const express = require('express');
const router = express.Router();
const {
  getSections,
  createSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');

// GET /api/sections - Get all sections
router.get('/', getSections);

// POST /api/sections - Create new section
router.post('/', createSection);

// PUT /api/sections/:id - Update section
router.put('/:id', updateSection);

// DELETE /api/sections/:id - Delete section
router.delete('/:id', deleteSection);

module.exports = router;
