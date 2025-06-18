const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
        const userId = decodedToken.userId;
        const role = decodedToken.role;

        req.auth = { userId, role };

        if (req.body.userId && req.body.userId !== userId && role !== 'admin') {
            return res.status(403).json({ message: 'Invalid Request!' });
        }

        next();
    } catch {
        res.status(401).json({
            error: new Error('Unauthenticated Request!')
        });
    }
};
