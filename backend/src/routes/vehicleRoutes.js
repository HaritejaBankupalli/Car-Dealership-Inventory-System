const express = require('express');
const {
  createVehicle,
  getAllVehicles,
  searchVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} = require('../controllers/vehicleController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All vehicle routes require a valid JWT.
router.use(authenticate);

// NOTE: /search must be declared before the /:id route, otherwise
// Express would treat "search" as an :id parameter.
router.get('/search', searchVehicles);

router.post('/', createVehicle);
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', requireAdmin, deleteVehicle);

router.post('/:id/purchase', purchaseVehicle);
router.post('/:id/restock', requireAdmin, restockVehicle);

module.exports = router;
