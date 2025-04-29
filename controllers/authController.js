const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const generateToken = (id, role) => {
        return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      };
      const token = generateToken(user._id, user.role);
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); 
  
      // ✅ Send user info (excluding password) back
      res.json({ 
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  
exports.getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // don't return password
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  exports.logout = (req, res) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  