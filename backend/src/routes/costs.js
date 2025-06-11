const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

// Validation middleware
const validateCost = [
  body('service_name').trim().notEmpty().withMessage('Service name is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('billing_date').isISO8601().withMessage('Valid billing date is required'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
];

// POST /api/costs
router.post('/', validateCost, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { service_name, amount, category, billing_date, metadata } = req.body;

    // Insert the cost into the database
    const result = await db.query(
      `INSERT INTO costs (service_name, amount, category, billing_date, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [service_name, amount, category, billing_date, metadata]
    );

    // Return the created cost entry
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating cost:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 