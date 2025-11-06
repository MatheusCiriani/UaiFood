// src/routes/orderRoutes.js
const { Router } = require('express');
const orderController = require('../controllers/orderController');

const router = Router();

// --- CREATE ---
// POST /orders
router.post('/', orderController.create);

// --- READ (All) ---
// GET /orders
router.get('/', orderController.getAll);

// --- READ (by ID) ---
// GET /orders/:id
router.get('/:id', orderController.getById);

// --- UPDATE (Status/Payment) ---
// PUT /orders/:id
router.put('/:id', orderController.update);

// --- DELETE ---
// DELETE /orders/:id
router.delete('/:id', orderController.delete);

module.exports = router;