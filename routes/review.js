const express = require('express')

const wrapAsync = require('../utils/wrapAsyc.js')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')
const { addNewReview, deleteReview } = require('../controllers/reviews.js')


const router = express.Router({ mergeParams: true });

// add-new-review, Post
router.post("/",
  isLoggedIn,
  validateReview,
  wrapAsync(addNewReview))

// delete to single review
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview))

module.exports = router;