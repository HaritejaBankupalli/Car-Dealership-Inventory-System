/**
 * authMiddleware.js
 * ------------------
 * `authenticate` verifies the JWT bearer token on protected routes
 * and attaches the decoded payload to `req.user`.
 *
 * `requireAdmin` is a follow-up guard for admin-only endpoints
 * (delete vehicle, restock). It must run after `authenticate`.
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
}

module.exports = { authenticate, requireAdmin, JWT_SECRET };
