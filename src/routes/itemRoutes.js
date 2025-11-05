// src/routes/itemRoutes.js
const { Router } = require('express');
const itemController = require('../controllers/itemController');

const router = Router();

// --- CREATE ---
// POST /items
router.post('/', itemController.create);

// --- READ (All) ---
// GET /items
router.get('/', itemController.getAll);

// --- READ (by ID) ---
// GET /items/:id
router.get('/:id', itemController.getById);

// --- UPDATE ---
// PUT /items/:id
router.put('/:id', itemController.update);

// --- DELETE ---
// DELETE /items/:id
router.delete('/:id', itemController.delete);

module.exports = router;