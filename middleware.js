const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require('./schema')
const ExpressError = require('./utils/ExpressError.js')


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'you must be LogIn')
    return res.redirect('/login')
  }
  next()
}

// yha middleware ek trika s kam isi k kr rha h ---> isVirtual_Catalog_Owner_With_Shayam_Baba_Ashirwad <--- bcz jab ek hi user lisiting kr rha h to fr owner kable whi hoga n
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this Listing!")
    return res.redirect(`/listings/${id}`)
  }
  next()
}

module.exports.validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    let errMsg = result.error.details.map((eachDetails) => eachDetails.message).join("<___Kshitiz___Garg___>")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId, id } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this Review!")
    return res.redirect(`/listings/${id}`)
  }
  next()
}

module.exports.validateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    let errMsg = result.error.details.map((eachDetails) => eachDetails.message).join("<___Kshitiz___Garg___>")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

module.exports.isVirtual_Catalog_Owner_With_Shayam_Baba_Ashirwad = (req, res, next) => {
  if (req.user && req.user.email !== process.env.JAI_SHREE_SHYAM) {
    req.flash("error", "⚠️ Access Denied! — Yeh Shyam Baba ka virtual catalog hai 🙏. Galat niyat se door raho, Baba sab dekh rahe hain.");
    return res.redirect('/')
  }
  next()
}