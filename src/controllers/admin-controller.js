const Product = require("../models/product-model");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isEditing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  req.user
    .createProduct({
      title: req.body.title,
      imgUrl: req.body.imgUrl,
      description: req.body.description,
      price: req.body.price,
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProductsPage = (req, res, next) => {
  req.user
    .getProducts()
    .then((rows) => {
      res.render("admin/products", {
        products: rows,
        pageTitle: "Admin Products",
        path: "/admin/products",
        hasProducts: rows.length > 0,
      });
    })
    .catch((err) => console.log(err));
};

exports.editProductsPage = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.prodId;
  if (!editMode) return res.redirect("/");

  Product.findByPk(prodId).then((prod) => {
    if (!prod) return res.redirect("/");
    res.render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      isEditing: editMode,
      product: prod,
    });
  });
};

exports.editProduct = (req, res, next) => {
  Product.findByPk(req.body.productId)
    .then((p) => {
      p.title = req.body.title;
      p.imUrl = req.body.imgUrl;
      p.description = req.body.description;
      p.price = req.body.price;
      return p.save();
    })
    .then((result) => {
      console.log("PRODUCT UPDATED", req.body.productId);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  Product.findByPk(req.body.productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("PRODUCT DELETED", req.body.productId);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
