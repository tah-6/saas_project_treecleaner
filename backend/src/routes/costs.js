const express = require('express');
const router = express.Router();
const itCostController = require('../controllers/itCostController');

// GET all costs
router.get('/', itCostController.getAllCosts);

// GET a single cost by ID
router.get('/:id', itCostController.getCostById);

// POST a new cost
router.post('/', itCostController.createCost);

// PUT update a cost
router.put('/:id', itCostController.updateCost);

// DELETE a cost
router.delete('/:id', itCostController.deleteCost);

module.exports = router; 