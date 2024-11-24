const express = require('express');
const UserFormRelated = require('../models/userform-related');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const user = await new Promise((resolve, reject) => {
            jwt.verify(token, 'your_jwt_secret', (err, user) => {
                if (err) return reject(err);
                resolve(user);
            });
        });
        req.currentUser = user; 
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(403).json({ message: 'Invalid token' });
    }
};
router.get("/user-forms-related", authenticateToken, async (req, res) => {
    const currentUser = req.currentUser;
    try {
        const relatedShareForm = await UserFormRelated.find({userId: currentUser.id}).populate('documentId');
        res.send({ relatedShareForm });
    } catch (error) {
        handleError(res, error, 'Error fetching documents');
    }
});
module.exports = router;