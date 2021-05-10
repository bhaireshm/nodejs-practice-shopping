const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProductPage);

// /admin/products => GET
router.get("/products", adminController.getProductsPage);

// /admin/edit-product => GET
router.get("/edit-product/:prodId", adminController.editProductsPage);

// /admin/delete-product => POST
router.post("/delete-product", adminController.deleteProduct);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// /admin/edit-product => POST
router.post("/edit-product", adminController.editProduct);

module.exports = router;
