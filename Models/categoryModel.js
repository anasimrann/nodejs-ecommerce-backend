const mongoose = require("mongoose");
const { Product } = require("./productModels");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

let Category = mongoose.model("Category", categorySchema);
module.exports = { Category };

categorySchema.pre("remove", async function (next) {
  const categoryId = this._id;

  await Product.deleteMany({ category: categoryId });

  next();
});
