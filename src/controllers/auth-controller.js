const User = require("../models/user-model");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  let messages = req.flash("error");
  if (messages.length > 0) messages = messages[0];
  else messages = null;

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: messages,
  });
};

exports.getSignup = (req, res, next) => {
  let messages = req.flash("error");
  if (messages.length > 0) messages = messages[0];
  else messages = null;

  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errorMessage: messages,
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(req.body.password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              req.session.user = user;
              req.session.isLoggedIn = true;
              return req.session.save((err) => {
                console.log(err);
                res.redirect("/");
              });
            }
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        req.flash("error", "Invalid email or password.");
        res.redirect("/login");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  // const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email exists already. pick a different one");
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then((result) => {
      console.log("User created ", result);
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
