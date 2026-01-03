const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// GET all subscriptions
router.get('/', subscriptionController.getAllSubscriptions);

// GET a single subscription by ID
router.get('/:id', subscriptionController.getSubscriptionById);

// POST a new subscription
router.post('/', subscriptionController.createSubscription);

// PUT update a subscription
router.put('/:id', subscriptionController.updateSubscription);

// DELETE a subscription
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router; 