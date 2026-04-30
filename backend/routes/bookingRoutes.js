const express = require('express');
const router = express.Router();
const { createBooking, getClientBookings, getAdvisorBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/create', createBooking);
router.get('/client/:clientId', getClientBookings);
router.get('/advisor/:advisorId', getAdvisorBookings);
router.put('/status/:bookingId', updateBookingStatus);

module.exports = router;