const axios = require('axios');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Paymob Config
// @route   GET /api/payment/config
// @access  Private
const getStripeConfig = (req, res) => {
  res.send({
    iframeId: process.env.PAYMOB_IFRAME_ID,
  });
};

// @desc    Create Paymob Payment Key
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const { cartItems } = req.body;
    // req.user is populated by protect middleware
    const user = await User.findById(req.user._id);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // 1. Calculate Total Amount
    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (product) {
        totalAmount += product.price * item.qty;
      }
    }
    const amountInCents = Math.round(totalAmount * 100);

    // 2. Authentication Request
    let authToken;
    try {
        const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', {
          api_key: process.env.PAYMOB_API_KEY
        });
        authToken = authResponse.data.token;
    } catch (authError) {
        console.error('Paymob Auth Error:', authError.response?.data);
        throw new Error('Paymob Authentication Failed: Check API Key');
    }

    // 3. Order Registration API
    let orderId;
    try {
        const orderResponse = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
          auth_token: authToken,
          delivery_needed: "false",
          amount_cents: amountInCents,
          currency: "EGP",
          items: cartItems.map(item => ({
            name: item.name,
            amount_cents: Math.round(item.price * 100),
            description: item.name,
            quantity: item.qty
          }))
        });
        orderId = orderResponse.data.id;
    } catch (orderError) {
        console.error('Paymob Order Error:', orderError.response?.data);
        throw new Error('Paymob Order Creation Failed');
    }

    // 4. Payment Key Request
    // Ensure we have some data even if user didn't fill it all perfectly, Paymob is strict
    // We are using default/fallback values for required fields not strictly collected yet
    const billingData = {
      apartment: "NA", 
      email: user.email, 
      floor: "NA", 
      first_name: user.firstName || "Customer", 
      street: user.address?.street || "NA", 
      building: "NA", 
      phone_number: user.phoneNumber || "+201000000000", 
      shipping_method: "NA", 
      postal_code: user.address?.zip || "NA", 
      city: user.address?.city || "Cairo", 
      country: user.address?.country || "EG", 
      last_name: user.lastName || "User", 
      state: user.address?.state || "NA"
    };

    const keyResponse = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
      auth_token: authToken,
      amount_cents: amountInCents,
      expiration: 3600, 
      order_id: orderId,
      billing_data: billingData,
      currency: "EGP",
      integration_id: parseInt(process.env.PAYMOB_INTEGRATION_ID)
    });

    res.send({
      token: keyResponse.data.token,
      iframeId: process.env.PAYMOB_IFRAME_ID
    });

  } catch (error) {
    console.error('Paymob Error:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.detail || error.message });
  }
};

module.exports = {
  getStripeConfig,
  createPaymentIntent,
};
