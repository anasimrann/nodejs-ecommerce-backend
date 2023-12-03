const express = require("express");
const { DB } = require("./db");
const app = express();
require("dotenv").config();
const category = require("./Routes/CategoryRoutes");
const product = require("./Routes/ProductRoutes");

DB();

app.use(express.json());
app.use("/category", category);
app.use("/product", product);
let PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  return res.status(422).json({
    success: false,
    data: [],
    message: [err.message],
  });
});

app.listen(PORT, () => {
  console.log(`server is running at PORT ${PORT}`);
});
