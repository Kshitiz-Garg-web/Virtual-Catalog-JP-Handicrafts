const Listing = require('../models/listing')
const Review = require('../models/review')

// add-new-review, Post
module.exports.addNewReview = async (req, res) => {
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

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created!")
  res.redirect(`/listings/${id}`)
}

// delete-review, Delelte
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted !")
  res.redirect(`/listings/${id}`)
}