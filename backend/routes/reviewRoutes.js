const express = require('express');
const router = express.Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');

router.get('/:lawyer_id', getReviews);
router.post('/:lawyer_id', addReview);
router.delete('/:review_id', deleteReview);

module.exports = router;