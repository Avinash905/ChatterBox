const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongodbconn = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongodb connection established");
  })
  .catch(() => {
    console.log("mongodb connection error");
  });

module.exports = mongodbconn;
