const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const path = require("path");

const Listing = require("./models/listing");

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

app.get("/", (req, res) => {
  res.send("yes i am root");
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing.price);
  res.render("listings/show.ejs", { listing });
});

app.post("/listings", async (req, res) => {
  const newListingData = req.body.listing;
  const newListing = new Listing(newListingData);
  await newListing.save();
  // console.log(newListingData);
  res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;
  await Listing.findByIdAndUpdate(id, { ...updatedData });
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const deletedListings = await Listing.findByIdAndDelete(id);
  console.log(deletedListings);
  res.redirect("/listings");
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
