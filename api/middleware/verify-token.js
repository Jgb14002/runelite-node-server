const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.header.authorization.split(" ")[1];
        const key = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, key);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'You are not authorized to access this resource.'
        });
    }
}