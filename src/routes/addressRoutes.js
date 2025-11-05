    // src/routes/addressRoutes.js
const { Router } = require('express');
const addressController = require('../controllers/addressController');

const router = Router();

// --- CREATE ---
// POST /addresses
router.post('/', addressController.create);

// --- READ (All) ---
// GET /addresses
router.get('/', addressController.getAll);

// --- READ (by ID) ---
// GET /addresses/:id
router.get('/:id', addressController.getById);

// --- UPDATE ---
// PUT /addresses/:id
router.put('/:id', addressController.update);

// --- DELETE ---
// DELETE /addresses/:id
router.delete('/:id', addressController.delete);

module.exports = router;