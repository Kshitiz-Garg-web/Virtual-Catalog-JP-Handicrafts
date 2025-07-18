const mongoose = require("mongoose");

const initData = require("./data");
const Listing = require("../models/listing");

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

const initDB = async () => {
  await Listing.deleteMany({});
  const updated_sample_data = initData.data.map((obj) => { return { ...obj, owner: "6870c54316de7ce3af110912" } })
  await Listing.insertMany(updated_sample_data);
  console.log("saved hua---- listings ----sab ok");
};

initDB();
