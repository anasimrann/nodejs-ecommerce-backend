const mongoose = require("mongoose");

const DB = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { DB };
