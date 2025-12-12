const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getSections,
  createSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');

// All routes require authentication
router.use(authMiddleware);

// GET /api/sections - Get all sections
router.get('/', getSections);

// POST /api/sections - Create new section
router.post('/', createSection);

// PUT /api/sections/:id - Update section
router.put('/:id', updateSection);

// DELETE /api/sections/:id - Delete section
router.delete('/:id', deleteSection);

module.exports = router;
