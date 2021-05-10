const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./src/utils/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views/");

const adminRoutes = require("./src/routes/admin-route");
const shopRoutes = require("./src/routes/shop-route");
const errorController = require("./src/controllers/error");
const Product = require("./src/models/product-model");
const User = require("./src/models/user-model");
const Cart = require("./src/models/cart/cart-model");
const Order = require("./src/models/order/order-model");
const CartItem = require("./src/models/cart/car-item-model");
const OrderItem = require("./src/models/order/order-item-model");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "./src/public")));

// Passing user details to req
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// APIs
app.use("/", shopRoutes);
app.use("/admin", adminRoutes);
app.use(errorController.get404Page);

// Associations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Product.belongsToMany(Cart, { through: CartItem });
User.hasOne(Cart);
User.hasMany(Product);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((res) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Bhairesh",
        email: "bhairesh@mailinator.com",
      });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((res) => {
    // console.log(res);
    app.listen(3333, console.log("App started and listening to port 3333"));
  })
  .catch((err) => console.log(err));
