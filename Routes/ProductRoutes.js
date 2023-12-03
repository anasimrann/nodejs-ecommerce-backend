const express = require("express");
const {
  addProduct,
  getOneProductDetails,
  updateProduct,
  browseProductsByCategory,
  deleteProductById,
} = require("../Controllers/productController");
const { upload } = require("../Middleware/multer");
const router = express.Router();

router.post("/add", upload.array("photo"), addProduct);
router.get("/details/:id", getOneProductDetails);
router.put("/update/:id", upload.array("photo"), updateProduct);
router.get("/browse/category", browseProductsByCategory);
router.delete("/delete/:id", deleteProductById);

module.exports = router;
