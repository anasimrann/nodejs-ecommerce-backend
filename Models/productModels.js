const mongoose = require("mongoose");
const { Image } = require("./imageModel");
const { Schema } = mongoose;

let productSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },

    slug: {
      type: String,
    },

    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  {
    timestamps: true,
  }
);

let Product = mongoose.model("Product", productSchema);
module.exports = { Product };