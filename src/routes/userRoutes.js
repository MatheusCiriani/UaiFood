// src/routes/userRoutes.js
const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

// --- CREATE ---
// POST /users
router.post('/', userController.create);

// --- READ (All) ---
// GET /users
router.get('/', userController.getAll);

// --- READ (by ID) ---
// GET /users/:id
router.get('/:id', userController.getById);

// --- UPDATE ---
// PUT /users/:id
router.put('/:id', userController.update);

// --- DELETE ---
// DELETE /users/:id
router.delete('/:id', userController.delete);

module.exports = router;