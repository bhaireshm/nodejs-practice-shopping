const mongoose = require("mongoose");
const User = require("../models/user-model");
const MONGODB_URI =
  // "mongodb+srv://bhaireshm:10Vlc0rDCxpQQlKj@cluster0.kple9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true&authSource=admin";
  "mongodb://localhost:27017/nodejsShopping?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true";

const mongooseConnect = (cb) => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => {
      return User.findOne().then((user) => {
        if (!user) {
          const user = new User({
            name: "Bhairesh",
            email: "bhaireshmailinator.com",
            cart: { items: [] },
          });
          return user.save();
        }
        return user;
      });
    })
    .then((result) => {
      // console.log(result);
      cb(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { MONGODB_URI, mongooseConnect };
