const express = require('express');
const { adminLogin, getAllUsers, getAllIDCardRequests, updateIDCardRequestStatus, generateIDCard } = require('../controllers/adminController');
const { verifyToken, checkAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin Login Route
router.post('/login', adminLogin);

// Admin-only routes
router.get('/users', verifyToken, checkAdmin, getAllUsers);
router.get('/idcard/requests', verifyToken, checkAdmin, getAllIDCardRequests);
router.put('/idcard/requests/:id', verifyToken, checkAdmin, updateIDCardRequestStatus);
router.post('/idcard/generate/:userId', verifyToken, checkAdmin, generateIDCard);

module.exports = router;