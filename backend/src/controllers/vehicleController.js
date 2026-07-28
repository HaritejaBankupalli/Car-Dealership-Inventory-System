/**
 * vehicleController.js
 * ----------------------
 * Business logic for vehicle inventory management: listing,
 * searching, creating, updating, deleting, purchasing and restocking.
 */

const VehicleModel = require('../models/vehicleModel');

function validateVehiclePayload(body, { partial = false } = {}) {
  const errors = [];
  const required = ['make', 'model', 'category', 'price', 'quantity'];

  if (!partial) {
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        errors.push(`${field} is required`);
      }
    }
  }

  if (body.price !== undefined && Number(body.price) < 0) {
    errors.push('price must be a non-negative number');
  }
  if (body.quantity !== undefined && Number(body.quantity) < 0) {
    errors.push('quantity must be a non-negative integer');
  }

  return errors;
}

function createVehicle(req, res) {
  const errors = validateVehiclePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const vehicle = VehicleModel.create({
    make: req.body.make,
    model: req.body.model,
    category: req.body.category,
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    year: req.body.year ? Number(req.body.year) : null,
    image_url: req.body.image_url || null,
  });

  return res.status(201).json({ message: 'Vehicle added successfully', vehicle });
}

function getAllVehicles(req, res) {
  const vehicles = VehicleModel.findAll();
  return res.status(200).json({ count: vehicles.length, vehicles });
}

function searchVehicles(req, res) {
  const { make, model, category, minPrice, maxPrice } = req.query;
  const vehicles = VehicleModel.search({ make, model, category, minPrice, maxPrice });
  return res.status(200).json({ count: vehicles.length, vehicles });
}

function getVehicleById(req, res) {
  const vehicle = VehicleModel.findById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  return res.status(200).json({ vehicle });
}

function updateVehicle(req, res) {
  const errors = validateVehiclePayload(req.body, { partial: true });
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const vehicle = VehicleModel.update(req.params.id, req.body);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  return res.status(200).json({ message: 'Vehicle updated successfully', vehicle });
}

function deleteVehicle(req, res) {
  const deleted = VehicleModel.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  return res.status(200).json({ message: 'Vehicle deleted successfully' });
}

function purchaseVehicle(req, res) {
  const amount = Number(req.body.quantity) || 1;
  const result = VehicleModel.decreaseQuantity(req.params.id, amount);

  if (result.error === 'NOT_FOUND') {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  if (result.error === 'INSUFFICIENT_STOCK') {
    return res.status(409).json({ message: 'Insufficient stock for this purchase' });
  }

  return res.status(200).json({ message: 'Purchase successful', vehicle: result.vehicle });
}

function restockVehicle(req, res) {
  const amount = Number(req.body.quantity) || 1;
  const result = VehicleModel.increaseQuantity(req.params.id, amount);

  if (result.error === 'NOT_FOUND') {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  return res.status(200).json({ message: 'Restock successful', vehicle: result.vehicle });
}

module.exports = {
  createVehicle,
  getAllVehicles,
  searchVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
};
