const { Product } = require("../Models/productModels");
const { Image } = require("../Models/imageModel");

const addProduct = async (req, res) => {
  try {
    console.log(req.body);
    const timestampRandomness = Date.now();
    let product = new Product({
      name: req.body.name,
      slug: `${timestampRandomness}${req.body.name}`,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      type: req.body.type,
      category: req.body.category,
      subCategory: req.body.subCategory,
    });

    await product.save();

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let image = new Image({
          url: file.originalname,
        });
        await image.save();
        product.images.push(image._id);
      }
      await product.save();
    }

    return res.status(201).json({
      success: true,
      data: [],
      message: "Product added successfully",
    });
  } catch (err) {
    
    console.log(err.message);
    if (err.code == 11000) {
      return res.status(422).json({
        success: false,
        data: [],
        message: ["Product with this name already exists"],
      });
    }
    return res.status(500).json({
      success: false,
      data: [],
      message: [err.message],
    });
  }
};

const getOneProductDetails = async (req, res) => {
  try {
    let productId = req.params.id;
    let productDetails = await Product.findById(productId).populate("images");
    if (!productDetails) {
      return res.status(422).json({
        success: false,
        data: [],
        message: ["Sorry no product found"],
      });
    }
    return res.status(200).json({
      success: true,
      data: productDetails,
      message: [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      message: [err.message],
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log(req.body);
    const productId = req.params.id;
    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product information
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.category = req.body.category;
    product.subCategory = req.body.subCategory;
    product.type = req.body.type;

    // Handle images
    if (req.files && req.files.length > 0) {
      // Clear existing images
      product.images = [];

      // Add new images
      for (const file of req.files) {
        let image = new Image({
          url: file.originalname,
        });
        await image.save();
        product.images.push(image._id);
      }
    }

    // Save the updated product
    await product.save();

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      data: [error.message],
      message: "Internal Server Error",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find();
    return res.status(200).json({
      success: false,
      data: products,
      message: [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      mesasge: [err.message],
    });
  }
};

const browseProductsByCategory = async (req, res) => {
  try {
    console.log(req.query);
    let category = req.query.category;
    let subcategory = req.query.subcategory;

    let products = [];
    if (category && subcategory) {
      products = await Product.find({
        $and: [{ category: category, subCategory: subcategory }],
      });
    } else {
      console.log("i am hit");
      products = await Product.find({
        $or: [{ category: category }, { subCategory: subcategory }],
      });
    }

    if (!products) {
      return res.status(422).json({
        success: false,
        data: [],
        message: ["No products found for this category"],
      });
    }
    return res.status(200).json({
      success: true,
      data: products,
      message: [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      message: [err.message],
    });
  }
};

const deleteProductById = async (req, res) => {
  try {
    let productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: false,
      data: [],
      message: ["product delete successfully"],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      message: [err.message],
    });
  }
};

module.exports = {
  addProduct,
  getOneProductDetails,
  updateProduct,
  browseProductsByCategory,
  deleteProductById,
  getAllProducts,
};
