const express = require("express");
const productController = require("../Controllers/ProductController");

const router = express.Router();

router.route("/").get(productController.getAllData);

router
  .route("/create-products")
  .post(
    productController.uploadProductPhoto,
    productController.resizeProductPhoto,
    productController.createProduct
  );

router.route("/delete").delete(productController.deleteAllProduct);
router
  .route("/:id")
  .patch(productController.uploadProductPhoto, productController.updateOne)
  .delete(productController.deleteProduct);

module.exports = router;
