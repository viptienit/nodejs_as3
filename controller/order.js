const UserDB = require("../Model/UserDB");
const OrderDB = require("../Model/OrderDB");
const { createJWT } = require("../middleware/CheckJWT");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const ProductModel = require("../Model/ProductDB");
// hàm thay đổi giá trị price
const convertMoney = (money) => {
  const str = money + "";
  let output = "";

  let count = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    count++;
    output = str[i] + output;

    if (count % 3 === 0 && i !== 0) {
      output = "." + output;
      count = 0;
    }
  }
  return output;
};
// mailer
// khai báo sử dụng module nodemailer
const sendMail = (fullname, phone, address, cart, total, email) => {
  const filePath = path.join(__dirname, "../sendEmail/index.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const reqlacements = {
    fullname: fullname,
    phone: phone,
    address: address,
    cart: cart,
    total: convertMoney(total),
  };
  const htmlToSend = template(reqlacements);
  var transporter = nodemailer.createTransport({
    // config mail server
    service: "Gmail",
    auth: {
      user: "loipnfx21822@funix.edu.vn",
      pass: "erkz ssht zjzh fswy",
    },
  });
  var mainOptions = {
    // thiết lập đối tượng, nội dung gửi mail
    from: "Lợi Rơi",
    to: email,
    subject: "Test Nodemailer",
    html: htmlToSend,
  };
  transporter.sendMail(mainOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};
//erkz ssht zjzh fswy
exports.orderUser = async (req, res, next) => {
  // tạo mới order
  OrderDB.create({
    userId: req.user.id,
    fullname: req.user.fullname,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    cart: req.body.cart,
    total: req.body.total,
    time: req.body.time,
    status: "chưa thanh toán",
  })
    .then((data) => {
      // gửi lại token
      const token = createJWT({
        fullname: req.user.fullname,
        id: req.user.id,
        cart: [],
        role: req.user.role,
      });
      res.cookie("jwt", token, { httpOnly: true });
      console.log("theem ok");
    })
    .catch((err) => res.send({ err: "err", message: err.message }));
  // caaph nhật lại giỏ hàng của khác hàng
  UserDB.updateOne({ _id: req.user.id }, { cart: [] })
    .then((data) => {
      res.send("sưa thnah cong");
    })
    .catch((err) => res.send({ err: "err", message: err.message }));
  // thay đổi số lượng sản phẩm của cửa hàng
  for (let x = 0; x < req.body.cart.length; x++) {
    ProductModel.find({ _id: req.body.cart[x].idProduct })
      .then((data) => {
        ProductModel.updateOne(
          { _id: req.body.cart[x].idProduct },
          { sl: data[0].sl - req.body.cart[x].count }
        )
          .then((data) => console.log("thanh cong"))
          .catch((err) => res.send({ err: "err", message: err.message }));
      })
      .catch((err) => res.send({ err: "err", message: err.message }));
  }
  //gửi mail theo thông tin của khách hàng
  sendMail(
    req.user.fullname,
    req.body.phone,
    req.body.address,
    req.body.cart,
    req.body.total,
    req.body.email
  );
};
//tìm kiếm đơn hàng theo id
exports.getOrderId = (req, res, next) => {
  if (req.query.order) {
    OrderDB.find({ _id: req.query.order })
      .then((data) => {
        res.send(data[0]);
      })
      .catch((err) => res.send({ err: "err", message: err.message }));
  } else {
    OrderDB.find({ userId: req.user.id })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => res.send({ err: "err", message: err.message }));
  }
};
// tất cả các order
exports.getAllOrder = (req, res, next) => {
  OrderDB.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.send({ err: "err", message: err.message }));
};
