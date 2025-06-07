const express = require("express");
const mongoose = require("mongoose");

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

app.get("/", (req, res) => {
  res.send("yes i am root");
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing.price);
  res.render("listings/show.ejs", { listing });
});

// app.get("/listing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "my new home",
//     description: "by the beach",
//     price: 1200,
//     location: "meerut",
//     country: "india",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
