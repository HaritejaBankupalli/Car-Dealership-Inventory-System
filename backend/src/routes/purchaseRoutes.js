/**
 * purchaseRoutes.js
 * ------------------
 * Express routes for viewing personal purchase history & admin sales ledger.
 */

const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { getMyPurchases, getAllPurchases } = require('../controllers/purchaseController');

const router = express.Router();

router.get('/my', authenticate, getMyPurchases);
router.get('/all', authenticate, requireAdmin, getAllPurchases);

module.exports = router;
