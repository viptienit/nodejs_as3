const ProductDB = require("../Model/ProductDB");
require("dotenv").config();
const imgUrl = process.env.IMG_URL;
//tìm kiếm tất cả product
exports.getProduts = (req, res, next) => {
  ProductDB.find({})
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
};
//tìm kiếm product theo id
exports.getProdutId = (req, res, next) => {
  ProductDB.find({ _id: req.params.id })
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
};
// tìm kiếm product theo category
exports.getProductPagination = (req, res, next) => {
  if (req.query.category === "all") {
    ProductDB.find({})
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  } else {
    ProductDB.find({ category: req.query.category })
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  }
};
exports.updateProduct = (req, res, next) => {
  // check midleware xem có phải admin ko
  if (req.user.role === "admin") {
    ProductDB.updateOne(
      { _id: req.params.id },
      {
        category: req.body.category,
        name: req.body.name,
        price: req.body.price,
        long_desc: req.body.longDesc,
        short_desc: req.body.shortDesc,
        sl: req.body.sl,
      }
    )
      .then((data) => res.send("update thành công"))
      .catch((err) => res.send({ err: "err", message: err.message }));
  } else {
    // trả lỗi
    res.send({ err: "err", message: "bạn không phải admin" });
  }
};
exports.deleteProduct = (req, res) => {
  if (req.user.role === "admin") {
    ProductDB.deleteOne({ _id: req.params.id })
      .then((data) => res.send("Delete thành công"))
      .catch((err) => res.send({ err: "err", message: err.message }));
  } else {
    // trả lỗi
    res.send({ err: "err", message: "bạn không phải admin" });
  }
};
exports.postProduct = (req, res, next) => {
  if (req.user.role === "admin") {
    const imageUrl = req.files.map((mov) => mov.path);
    ProductDB.create({
      category: req.query.category,
      name: req.query.name,
      img1: imgUrl + "/" + imageUrl[0],

      img2: imgUrl + "/" + imageUrl[1],
      img3: imgUrl + "/" + imageUrl[2],
      img4: imgUrl + "/" + imageUrl[3],
      long_desc: req.query.long_desc,
      sl: req.query.sl,
      price: req.query.price,
      short_desc: req.query.shortDesc,
    });
    res.send("Đã thêm thành công");
  } else {
    // trả lỗi
    res.send({ err: "err", message: "bạn không phải admin" });
  }
};
