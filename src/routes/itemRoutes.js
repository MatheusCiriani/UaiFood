// src/routes/itemRoutes.js
const { Router } = require('express');
const itemController = require('../controllers/itemController');
const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');

const router = Router();

// --- CREATE ---
// POST /items
router.post('/',[checkAuth, checkAdmin], itemController.create);

// --- READ (All) ---
// GET /items
router.get('/', itemController.getAll);

// --- READ (by ID) ---
// GET /items/:id
router.get('/:id', itemController.getById);

// --- UPDATE ---
// PUT /items/:id
router.put('/:id',[checkAuth, checkAdmin], itemController.update);

// --- DELETE ---
// DELETE /items/:id
router.delete('/:id',[checkAuth, checkAdmin], itemController.delete);

module.exports = router;