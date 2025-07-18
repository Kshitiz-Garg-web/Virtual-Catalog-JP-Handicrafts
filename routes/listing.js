const express = require('express')

const wrapAsync = require('../utils/wrapAsyc.js')
const Listing = require("../models/listing.js");
const { listingSchema } = require('../schema.js')
const ExpressError = require('../utils/ExpressError.js')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')


const router = express.Router();

//get lisitng page
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//get new lisitng add form
router.get("/new", isLoggedIn, (req, res) => {

  res.render("listings/new.ejs");
});

//get deatil page of single lisitng by using id
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  // const listing = await Listing.findById(id).populate("reviews").populate('owner')
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: 'author'
      }
    })
    .populate('owner')


  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist!')
    return res.redirect("/listings");
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
}));

//post hit for backend to add new lisiting 
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
  // bcz this part is covered by joi and also a each item 
  // if (!req.body.listing) {
  //   throw new ExpressError(400, 'send valid data for listing')
  // }

  const newListingData = req.body.listing;
  const newListing = new Listing(newListingData);

  newListing.owner = req.user;

  await newListing.save();
  // console.log(newListingData);
  req.flash("success", "New Listing Created!")
  res.redirect("/listings");
}))

//get edit listing page 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist!')
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
}));

// put hit for backend to edit the lisitng finally
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, 'send valid data for listing')
  // }

  let result = listingSchema.validate(req.body);
  console.log(result)
  console.log("-------------xxxxxxxxxxxxxx")
  if (result.error) {
    throw new ExpressError(400, result.error)
  }

  const { id } = req.params;
  const updatedData = req.body.listing;
  await Listing.findByIdAndUpdate(id, { ...updatedData });
  req.flash("success", "Linting Updated!")
  res.redirect(`/listings/${id}`);
}));

// delete hit for backend to delelte the lisitng finally from edit page
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListings = await Listing.findByIdAndDelete(id);

  console.log(deletedListings);
  req.flash("success", "Listing Deleted!")
  res.redirect("/listings");
}));

module.exports = router;