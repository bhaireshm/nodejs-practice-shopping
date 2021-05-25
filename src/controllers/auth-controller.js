const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const sendMail = require("./mail-controller");

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
    .then((user) => {
      console.log("User created ", user);
      res.redirect("/login");

      sendMail(
        email,
        "NodeJS Shopping",
        `<h1>Hello ${user.email} !!!</h1>` +
          "<h2>Your account created successfully</h2>"
      )
        .then((mail) => {
          console.log("Account creation mail sent to user " + user.email);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getResetPasswordPage = (req, res, next) => {
  let messages = req.flash("error");
  if (messages.length > 0) messages = messages[0];
  else messages = null;

  res.render("auth/reset-password", {
    pageTitle: "Reset Password",
    path: "/reset-password",
    errorMessage: messages,
  });
};

exports.postResetPassword = (req, res, next) => {
  const crypto = require("crypto");
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }

    const token = buffer.toString("hex");
    const email = req.body.email;
    console.log("taken", token, "email", email);

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email/User not found!.");
          return res.redirect("/reset-password");
        }
        // console.log("old user", user);

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 1000 * 60 * 60;
        return user.save();
      })
      .then((updatedUser) => {
        // console.log("updated user", updatedUser);
        const html = `<h1>Hello ${email}</h1>
        <h2>Please click on the <a href="http://localhost:3333/new-password/${token}">link</a> to reset password </h2>`;

        return sendMail(email, "Password Reset Link", html);
      })
      .then((emailResult) => {
        console.log("Reset password link sent to mail " + email);
        return res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPasswordPage = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } })
    .then((user) => {
      let messages = req.flash("error");
      if (messages.length > 0) messages = messages[0];
      else messages = null;

      res.render("auth/new-password", {
        pageTitle: "New Password",
        path: "/new-password",
        errorMessage: messages,
        userId: user._id,
        passwordToken: token,
      });
    })
    .catch((err) => {});
};

exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const token = req.body.passwordToken;
  let resetUser = null;

  User.findOne({
    _id: userId,
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Password update failed");
        return res.redirect("/login");
      }
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiry = null;
      return resetUser.save();
    })
    .then((updatedUser) => {
      // console.log(updatedUser);
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
