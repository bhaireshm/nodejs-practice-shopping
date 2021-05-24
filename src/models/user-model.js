const mongoose = require("mongoose");
const Order = require("./order-model");
const Product = require("./product-model");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// it cannot be arrow fn
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((ci) => {
    return ci.productId.toString() === product._id.toString();
  });

  let newQty = 1;
  let updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQty = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQty;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQty,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (ci) => ci.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

const User = mongoose.model("User", userSchema);
module.exports = User;
