const multer = require("multer");
const sharp = require("sharp");

const Product = require("../Models/Product");
const APIFeatures = require("../utils/ApiFeatures");
const catchAsync = require("../utils/CatchAsync");

const factory = require("./HandlerFactory");
const Category = require("../Models/Category");
const Subcategory = require("../Models/SubCategory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductPhoto = upload.single("image");

exports.resizeProductPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `product-${req.body.name}${Date.now()}.jpeg`;
  req.body.image = fileName;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/uploads/products/${fileName}`);
  next();
});

exports.createProduct = catchAsync(async (req, res) => {
  console.log(req.body);
  const productData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    subCategory: req.body.subCategory || null,
    tags: req.body.tags,
    productImage: req.body.image,
  };
  const newDoc = await Product.create(productData);
  setTimeout(() => {
    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  }, 1000);
});

exports.getAllData = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  const products = await Product.find();
  const subCategories = await Subcategory.find();
  const data = {
    categories,
    subCategories,
    products,
  };
  res.status(201).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getAllProducts = factory.getAll(Product);
exports.updateOne = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.deleteAllProduct = factory.deleteAll(Product);
