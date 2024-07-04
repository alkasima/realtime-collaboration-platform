// controllers/authController.js

const User = require('../models/User');
const userService = require('../services/userService');
const responseHelper = require('../helpers/responseHelper');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const token = await userService.registerUser(username, email, password);
    const user = await User.findOne({ email });

    // Send success response
    res.status(201).json(responseHelper.successResponse('User registered successfully', {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: token
    }));
  } catch (err) {
    // Handle specific errors
    if (err.message === 'User already exists') {
      return res.status(400).json(responseHelper.errorResponse('User already exists', 400));
    }
    console.error(err.message);
    res.status(500).json(responseHelper.errorResponse('Failed to register user', 500));
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await userService.loginUser(email, password);
    const user = await User.findOne({ email });

    // Send success response
    res.json(responseHelper.successResponse('User logged in successfully', {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: token
    }));
  } catch (err) {
    // Handle specific errors
    if (err.message === 'Invalid credentials') {
      return res.status(401).json(responseHelper.errorResponse('Invalid credentials', 401));
    }
    console.error(err.message);
    res.status(500).json(responseHelper.errorResponse('Login failed', 500));
  }
};

module.exports = {
  register,
  login,
};
