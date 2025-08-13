const jwt = require('jsonwebtoken');
const User = require('../models/User'); // make sure path is correct

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
    const userId = decodedToken.userId;
    const role = decodedToken.role;

    // Attach minimal auth data
    req.auth = { userId, role };

    // Fetch and attach the full user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;

    if (req.body.userId && req.body.userId !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'Invalid Request!' });
    }

    next();
  } catch (error) {
    res.status(401).json({
      error: new Error('Unauthenticated Request!')
    });
  }
};
