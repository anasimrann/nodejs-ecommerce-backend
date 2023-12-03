const mongoose = require("mongoose");

const DB = async () => {
  mongoose
    .connect("mongodb+srv://dev:mashaq123@ecommerce.bdyrdd0.mongodb.net/")
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { DB };
