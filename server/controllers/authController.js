const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const Stripe = require('stripe'); // Import Stripe to create customers
// Initialize stripe here or import from a config if available, but for now we trust env is loaded
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists by email OR username
    const user = await User.findOne({ 
        $or: [
            { email: email },
            { username: email }
        ]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        stripeCustomerId: user.stripeCustomerId,
        address: user.address,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, phoneNumber, password, address } = req.body;

    const userExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create a Stripe Customer (for saving cards later)
    let stripeCustomerId = null;
    try {
        const customer = await stripe.customers.create({
            email: email,
            name: `${firstName} ${lastName}`,
            phone: phoneNumber,
        });
        stripeCustomerId = customer.id;
    } catch (error) {
        console.error('Stripe customer creation failed:', error);
        // We can choose to continue without stripe ID or fail. 
        // For now, continue, but payment features might be limited.
    }

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      address: address || {},
      role: 'buyer', // Force role to buyer. Admin accounts must be created manually in DB or via seed script
      stripeCustomerId,
      isEmailVerified: false, // Default
      isPhoneVerified: false, // Default
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
