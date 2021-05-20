const Product = require("../models/product-model");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isEditing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const prod = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imgUrl: req.body.imgUrl,
    userId: req.user,
  });

  prod
    .save()
    .then((result) => {
      console.log("Product Created", result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProductsPage = (req, res, next) => {
  Product.find()
    // .select("title price")
    // .populate("userId")
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        products: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        hasProducts: products.length > 0,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.editProductsPage = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.prodId;
  if (!editMode) return res.redirect("/");

  Product.findById(prodId).then((prod) => {
    if (!prod) return res.redirect("/");
    res.render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      isEditing: editMode,
      product: prod,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.editProduct = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imgUrl = req.body.imgUrl;
      product.save();

      console.log("PRODUCT UPDATED", req.body.productId);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  Product.findByIdAndRemove(req.body.productId)
    .then((result) => {
      console.log("PRODUCT DELETED", result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
