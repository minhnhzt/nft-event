const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

// Tất cả routes đều yêu cầu admin role
router.use(auth, auth.getUser, auth.requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

// Event management
router.get('/events', adminController.getAllEvents);

// Template management
router.get('/templates', adminController.getAllTemplates);

// Mint management
router.get('/mints', adminController.getAllMintRecords);

module.exports = router; 