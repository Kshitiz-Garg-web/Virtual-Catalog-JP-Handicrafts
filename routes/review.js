const express = require('express')

const wrapAsync = require('../utils/wrapAsyc.js')
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')


const router = express.Router({ mergeParams: true });


// added new review by post req
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const id = req.params.id
  const newReviewData = req.body.review
  
  const listing = await Listing.findById(id)

  if (listing.owner.equals(req.user._id)) {
    req.flash('error', "As the owner of this listing, you’re not allowed to review it yourself.")
    return res.redirect(`/listings/${id}`)
  }
  const newReview = new Review(newReviewData)
  newReview.author = req.user._id
  listing.reviews.push(newReview)

  console.log('---------------------------')
  console.log(listing)
  console.log('---------------------------')

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created!")
  res.redirect(`/listings/${id}`)
}))

// delete to single review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  // console.log('id - ', id)
  // console.log('id_Review - ', reviewId)

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted !")
  res.redirect(`/listings/${id}`)
}))

module.exports = router;