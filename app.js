const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

const productRouter = require("./routes/Allroutes");
const subCategoryRouter = require("./routes/subCategoryRoutes");
const categoryRouter = require("./routes/CategoryRoutes");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(
  cors({
    origin: [
      "https://combative-dog-gloves.cyclic.app",
      // "https://vitalmediquip.co.ke",
      "https://localhost:5173",
    ],
    credentials: true,
    exposedHeaders: ["Content-Range"],
  })
);

// set http headers

app.use("/public", express.static("public"));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/v1/products", productRouter);
app.use("/api/v1/products/subCategory", subCategoryRouter);
app.use("/api/v1/products/category", categoryRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `cant find ${req.originalUrl} on this server!`,
  });
});
module.exports = app;
