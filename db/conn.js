const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongodbconn = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {})
  .catch(() => {});

module.exports = mongodbconn;
