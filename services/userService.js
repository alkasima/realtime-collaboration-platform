const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (username, email, password) => {
  try {
    // Check if the user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password, // Note: Ensure password is hashed in the User model or a pre-save hook
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser);

    return token;
  } catch (err) {
    throw new Error(err.message); // Re-throw the error to be caught in the controller
  }
};

const loginUser = async (email, password) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken(user);

    return token;
  } catch (err) {
    throw new Error(err.message); // Re-throw the error to be caught in the controller
  }
};

// Helper function to generate JWT token
const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
      role: user.role,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  registerUser,
  loginUser,
};