const express = require('express');
const router = express.Router();
const { adminLogin, getAllLawyers, verifyLawyer, getAllClients, getAllBookings, getAllBlogs, deleteBlog, deleteUser } = require('../controllers/adminController');

router.post('/login', adminLogin);
router.get('/lawyers', getAllLawyers);
router.put('/verify-lawyer/:id', verifyLawyer);
router.get('/clients', getAllClients);
router.get('/bookings', getAllBookings);
router.get('/blogs', getAllBlogs);
router.delete('/blog/:id', deleteBlog);
router.delete('/user/:id/:type', deleteUser);

module.exports = router;