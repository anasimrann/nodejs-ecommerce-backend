const mongoose = require("mongoose");
const { Image } = require("./imageModel");
const { Schema } = mongoose;

const subCategoriesEnum = [
  "bottom wear",
  "top wear",
  "foot wear",
  "bags",
  "null",
];
const category = ["men", "women", "null"];
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
      type: String,
      enum: category,
      default: "null",
    },

    subCategory: {
      type: String,
      enum: subCategoriesEnum,
      default: "null",
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Category",
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
