const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch (error) {
    // If the token is invalid or expired, we just proceed as a guest, 
    // or you could wipe the invalid user state. Here we proceed as guest.
    req.user = null;
  }
  
  next();
};

module.exports = optionalAuth;
