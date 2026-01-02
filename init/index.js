const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust1";

main()
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch((err) => {
    console.log("Error", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const intiDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68c5c3520f87b7ff6d09d389",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialised");
  //   mongoose.connection.close();
};

intiDB();
