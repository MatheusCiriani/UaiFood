    // src/routes/addressRoutes.js
const { Router } = require('express');
const addressController = require('../controllers/addressController');
const checkAuth = require('../middlewares/checkAuth');
const router = Router();

// --- CREATE ---
// POST /addresses
router.post('/',checkAuth, addressController.create);

// --- READ (All) ---
// GET /addresses
router.get('/',checkAuth, addressController.getAll);

// --- READ (by ID) ---
// GET /addresses/:id
router.get('/:id',checkAuth, addressController.getById);

// --- UPDATE ---
// PUT /addresses/:id
router.put('/:id',checkAuth, addressController.update);

// --- DELETE ---
// DELETE /addresses/:id
router.delete('/:id',checkAuth, addressController.delete);

module.exports = router;