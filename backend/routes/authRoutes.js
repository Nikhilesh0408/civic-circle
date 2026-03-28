const express = require('express');
const router = express.Router();
const { registerClient, registerAdvisor, login } = require('../controllers/authController');

// Register routes
router.post('/register/client', registerClient);
router.post('/register/advisor', registerAdvisor);

// Login route
router.post('/login', login);

module.exports = router;