require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, Authorization failed' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      msg: 'Invalid Token'
    });
    console.error(`ERROR in auth Middleware ${err.stack}`);
  }
};
