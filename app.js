const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const path = require("path");

const Listing = require("./models/listing");
const wrapAsync = require('./utils/wrapAsyc.js')
const ExpressError = require('./utils/ExpressError.js')
const listingSchema = require('./schema.js')



const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/VirtualCatalog";

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("yes i am root");
});

const validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    let errMsg = result.error.details.map((eachDetails) => eachDetails.message).join("<___Kshitiz___Garg___>")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});

  res.render("listings/index.ejs", { allListings });
}));

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  res.render("listings/show.ejs", { listing });
}));

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
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

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
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

app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListings = await Listing.findByIdAndDelete(id);
  console.log(deletedListings);
  res.redirect("/listings");
}));


app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render('error.ejs', { statusCode, message });

});


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
