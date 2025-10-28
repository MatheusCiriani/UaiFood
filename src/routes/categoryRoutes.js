// src/routes/categoryRoutes.js
const { Router } = require('express');
const categoryController = require('../controllers/categoryController');

const router = Router();

// "router.post('/', ...)" equivale a "app.post('/categories', ...)"
// porque vamos registrar este router no caminho '/categories' no index.js

// --- CREATE ---
router.post('/', categoryController.create);

// --- READ (All) ---
router.get('/', categoryController.getAll);

// --- READ (by ID) ---
router.get('/:id', categoryController.getById);

// --- UPDATE ---
router.put('/:id', categoryController.update);

// --- DELETE ---
router.delete('/:id', categoryController.delete);

module.exports = router;