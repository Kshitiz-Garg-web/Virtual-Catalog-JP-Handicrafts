const express = require('express')

const wrapAsync = require('../utils/wrapAsyc.js')
const Listing = require("../models/listing.js");
const { listingSchema } = require('../schema.js')
const ExpressError = require('../utils/ExpressError.js')

const router = express.Router();

const validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    let errMsg = result.error.details.map((eachDetails) => eachDetails.message).join("<___Kshitiz___Garg___>")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

//get lisitng page
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//get new lisitng add form
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//get deatil page of single lisitng by using id
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  console.log(listing);
  res.render("listings/show.ejs", { listing });
}));

//post hit for backend to add new lisiting 
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
  // bcz this part is covered by joi and also a each item 
  // if (!req.body.listing) {
  //   throw new ExpressError(400, 'send valid data for listing')
  // }

  const newListingData = req.body.listing;
  const newListing = new Listing(newListingData);

  await newListing.save();
  // console.log(newListingData);
  res.redirect("/listings");
}))

//get edit listing page 
router.get("/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// put hit for backend to edit the lisitng finally
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, 'send valid data for listing')
  // }

  let result = listingSchema.validate(req.body);
  console.log(result)
  if (result.error) {
    throw new ExpressError(400, result.error)
  }

  const { id } = req.params;
  const updatedData = req.body.listing;
  await Listing.findByIdAndUpdate(id, { ...updatedData });
  res.redirect(`/listings/${id}`);
}));

// delete hit for backend to delelte the lisitng finally from edit page
router.delete("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListings = await Listing.findByIdAndDelete(id);
  console.log(deletedListings);
  res.redirect("/listings");
}));

module.exports = router;