// src/routes/userRoutes.js
const { Router } = require('express');
const userController = require('../controllers/userController');
const checkAuth = require('../middlewares/checkAuth');

const router = Router();

// --- CREATE ---
// POST /users
router.post('/', userController.create);

// --- READ (All) ---
// GET /users
router.get('/',checkAuth, userController.getAll);

// --- READ (by ID) ---
// GET /users/:id
router.get('/:id',checkAuth, userController.getById);

// --- UPDATE ---
// PUT /users/:id
router.put('/:id',checkAuth, userController.update);

// --- DELETE ---
// DELETE /users/:id
router.delete('/:id',checkAuth, userController.delete);

module.exports = router;