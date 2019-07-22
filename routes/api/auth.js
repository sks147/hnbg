const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authMiddleware = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

/*
 * Test auth api
 * */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(`ERROR in GET api/auth : ${err.stack}`);
    res.status(500).send({ msg: 'Server Error' });
  }
});

/*
 * Authenticate user and get token
 * */
router.post(
  '/',
  [
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      // Check if user does not exist
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        `${process.env.JWT_SECRET}`,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ user_id: user._id, token });
        }
      );
    } catch (err) {
      res.status(500).send('Server Error');
      console.error(`ERROR in auth POST API path: '/' : ${err.stack}`);
    }

    console.log(req.body);
  }
);

module.exports = router;
