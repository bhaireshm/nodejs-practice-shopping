const express = require("express");
const authController = require("../controllers/auth-controller");
const isAuth = require("../middleware/is-auth");
const route = express.Router();

route.get("/login", authController.getLogin);

route.get("/signup", authController.getSignup);

route.post("/login", authController.postLogin);

route.post("/signup", authController.postSignup);

route.post("/logout", isAuth, authController.postLogout);

route.get("/reset-password", authController.getResetPasswordPage);

route.post("/reset-password", authController.postResetPassword);

route.get("/new-password/:token", authController.getNewPasswordPage);

route.post("/new-password", authController.postNewPassword);

module.exports = route;
