const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { MONGODB_URI, mongooseConnect } = require("./src/utils/database");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "./src/views/");

const adminRoutes = require("./src/routes/admin-route");
const shopRoutes = require("./src/routes/shop-route");
const { get404Page } = require("./src/controllers/error-controller");
const authRoute = require("./src/routes/auth-route");
const User = require("./src/models/user-model");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "./src/public")));
app.use(
  session({
    secret: "some random key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Passing user details to req
const userId = "609be413982cf15108afe55b";
app.use((req, res, next) => {
  User.findById(userId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// APIs
app.use("/", shopRoutes);
app.use("/admin", adminRoutes);
app.use(authRoute);
app.use(get404Page);

mongooseConnect(() => {
  app.listen(3333, console.log("App started and listening to port 3333"));
  console.log("MongoDB Connected!!");
});
