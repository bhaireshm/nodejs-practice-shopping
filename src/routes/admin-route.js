const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const isAuth = require("../middleware/is-auth");

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProductPage);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProductsPage);

// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

// /admin/edit-product => GET
router.get("/edit-product/:prodId", isAuth, adminController.editProductsPage);

// /admin/edit-product => POST
router.post("/edit-product", isAuth, adminController.editProduct);

// /admin/delete-product => POST
router.post("/delete-product", isAuth, adminController.deleteProduct);

module.exports = router;
