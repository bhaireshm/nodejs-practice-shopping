const express = require("express");
const authController = require("../controllers/auth-controller");
const route = express.Router();

route.get("/login", authController.getLogin);

route.get("/signup", authController.getSignup);

route.post("/login", authController.postLogin);

route.post("/logout", authController.postLogout);

module.exports = route;
