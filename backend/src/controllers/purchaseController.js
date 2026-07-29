/**
 * purchaseController.js
 * ----------------------
 * Controller for retrieving purchase transaction history for customers
 * and sales ledgers for dealership admins.
 */

const PurchaseModel = require('../models/purchaseModel');

function getMyPurchases(req, res) {
  try {
    const userId = req.user.id;
    const purchases = PurchaseModel.findByUserId(userId);
    return res.status(200).json({ purchases });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve purchase history', error: error.message });
  }
}

function getAllPurchases(req, res) {
  try {
    const purchases = PurchaseModel.findAll();
    
    // Calculate aggregate metrics for admin dashboard summary
    const totalRevenue = purchases.reduce((acc, p) => acc + (p.total_price || 0), 0);
    const totalUnitsSold = purchases.reduce((acc, p) => acc + (p.quantity || 0), 0);

    return res.status(200).json({
      summary: {
        totalRevenue,
        totalUnitsSold,
        totalOrders: purchases.length,
      },
      purchases,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve sales ledger', error: error.message });
  }
}

module.exports = {
  getMyPurchases,
  getAllPurchases,
};
