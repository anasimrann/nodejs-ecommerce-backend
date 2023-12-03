// const { Category } = require("../Models/categoryModel");

// const addCategory = async (req, res) => {
//   try {
//     let { name } = req.body;
//     let category = new Category();
//     category.name = name.toLowerCase();
//     await category.save();
//     return res.status(200).json({
//       success: true,
//       message: ["category added"],
//       data: [],
//     });
//   } catch (err) {
//     if (err.code == 11000) {
//       return res.status(422).json({
//         success: false,
//         data: [],
//         message: ["category with this name already exists"],
//       });
//     }
//     return res.status(500).json({
//       success: false,
//       data: [err.message],
//       message: [],
//     });
//   }
// };

// module.exports = { addCategory };
