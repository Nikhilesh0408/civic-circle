const express = require('express');
const router = express.Router();
const { getLawyers, getLawyerById } = require('../controllers/lawyerController');

router.get('/', getLawyers);
router.get('/:id', getLawyerById);

module.exports = router;