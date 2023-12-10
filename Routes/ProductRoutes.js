const express = require("express");
const {
  addProduct,
  getOneProductDetails,
  updateProduct,
  browseProductsByCategory,
  deleteProductById,
  getAllProducts,
  // uploadImage,
} = require("../Controllers/productController");
const { upload } = require("../Middleware/multer");
const router = express.Router();

router.post("/add", upload.array("photo"), addProduct);
router.get("/details/:id", getOneProductDetails);
router.put("/update/:id", upload.array("photo"), updateProduct);
router.get("/browse/:category", browseProductsByCategory);
router.get("/browse/:category/:subcategory", browseProductsByCategory);
router.get("/get", getAllProducts);
router.delete("/delete/:id", deleteProductById);
// router.post("/test", upload.single("photo"), uploadImage);

module.exports = router;
