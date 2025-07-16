const express = require('express');
const router = express.Router();
const controller = require('../controllers/sweetController');

// Home page (view sweets + search)
router.get('/', controller.getHome);

// Add sweet
router.post('/add', controller.addSweet);

// Delete sweet (with password)
router.post('/delete/:id', controller.deleteSweet);

// Purchase sweet
router.post('/purchase/:id', controller.purchaseSweet);

// Restock sweet (with password)
router.post('/restock/:id', controller.restockSweet);

module.exports = router;
