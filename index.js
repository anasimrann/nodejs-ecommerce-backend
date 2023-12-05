const express = require("express");
const { DB } = require("./db");
const app = express();
require("dotenv").config();
const category = require("./Routes/CategoryRoutes");
const product = require("./Routes/ProductRoutes");
var cors = require("cors");
const bodyParser = require("body-parser");

DB();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

app.use(cors());

// app.use("/", (req, res) => {
//   return res.status(200).json({
//     message: ["hello world"],
//     data: [],
//     success: true,
//   });
// });

// app.use("/category", category);
app.use("/product", product);
let PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  return res.status(422).json({
    success: false,
    data: [],
    message: ["asd"],
  });
});

app.listen(PORT, () => {
  console.log(`server is running at PORT ${PORT}`);
});
