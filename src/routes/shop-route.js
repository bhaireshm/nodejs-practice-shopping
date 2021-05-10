const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop-controller");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/product/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/add-to-cart", shopController.addToCart);

router.post("/cart-delete-item", shopController.deleteProductFromCart);

router.get("/orders", shopController.getOrders);

router.post("/create-order", shopController.postOrder);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
