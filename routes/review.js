const express = require('express')

const wrapAsync = require('../utils/wrapAsyc.js')
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require('../schema.js')
const ExpressError = require('../utils/ExpressError.js')


const router = express.Router({ mergeParams: true });



const validateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    let errMsg = result.error.details.map((eachDetails) => eachDetails.message).join("<___Kshitiz___Garg___>")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

router.post("/", validateReview, wrapAsync(async (req, res) => {
  const id = req.params.id
  const newReviewData = req.body.review

  const listing = await Listing.findById(id);
  const newReview = new Review(newReviewData)
  listing.reviews.push(newReview)

  console.log(newReview)

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${id}`)
}))

// delete to single review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  // console.log('id - ', id)
  // console.log('id_Review - ', reviewId)

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId);


  res.redirect(`/listings/${id}`)
}))

module.exports = router;