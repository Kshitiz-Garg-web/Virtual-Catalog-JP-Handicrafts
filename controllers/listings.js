const Listing = require('../models/listing')

//index-page, Get
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

//new-listing-form, Get
module.exports.newListingForm = (req, res) => {
  res.render("listings/new.ejs");
}

//detaile-listing-page, Get
module.exports.detaileListingPage = async (req, res) => {
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
}

// add-new-listing-details, Post
module.exports.addNewListingDetails = async (req, res, next) => {
  const url = req.file.path;
  const filename = req.file.filename;

  const newListingData = req.body.listing;
  const newListing = new Listing(newListingData);

  newListing.owner = req.user;
  newListing.image = { url, filename }

  await newListing.save();

  req.flash("success", "New Listing Created!")
  res.redirect("/listings");
}

// edit-listing-page, Get
module.exports.editListingPage = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist!')
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
}

// update-listing-details, Put
module.exports.updateListingDetails = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;
  await Listing.findByIdAndUpdate(id, { ...updatedData });
  req.flash("success", "Linting Updated!")
  res.redirect(`/listings/${id}`);
}

// delete-listing, Delete
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedListings = await Listing.findByIdAndDelete(id);
  console.log(deletedListings);
  req.flash("success", "Listing Deleted!")
  res.redirect("/listings");
}