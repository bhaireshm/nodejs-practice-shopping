const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { MONGODB_URI, mongooseConnect } = require("./src/utils/database");
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

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

app.use(csrfProtection);
app.use(flash());

// Passing user details to req
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
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
