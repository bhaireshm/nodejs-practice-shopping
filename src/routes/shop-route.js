const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop-controller");
const isAuth = require("../middleware/is-auth");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/product/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/add-to-cart", isAuth, shopController.addToCart);

router.post("/cart-delete-item", isAuth, shopController.deleteProductFromCart);

router.get("/orders", isAuth, shopController.getOrders);

router.post("/create-order", isAuth, shopController.postOrder);

module.exports = router;
