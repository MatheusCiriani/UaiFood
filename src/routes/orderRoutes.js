// src/routes/orderRoutes.js
const { Router } = require('express');
const orderController = require('../controllers/orderController');
const checkAuth = require('../middlewares/checkAuth');

const router = Router();

// --- CREATE ---
// POST /orders
router.post('/',checkAuth, orderController.create);

// --- READ (All) ---
// GET /orders
router.get('/',checkAuth, orderController.getAll);

// --- READ (by ID) ---
// GET /orders/:id
router.get('/:id',checkAuth, orderController.getById);

// --- UPDATE (Status/Payment) ---
// PUT /orders/:id
router.put('/:id',checkAuth, orderController.update);

// --- DELETE ---
// DELETE /orders/:id
router.delete('/:id',checkAuth, orderController.delete);

module.exports = router;