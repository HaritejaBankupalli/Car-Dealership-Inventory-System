/**
 * authController.js
 * ------------------
 * Handles user registration and login. Passwords are hashed with
 * bcrypt before storage; successful login returns a signed JWT.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'A user with that email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const safeRole = role === 'admin' ? 'admin' : 'customer';

    const user = UserModel.create({ name, email, hashedPassword, role: safeRole });

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

module.exports = { register, login };
