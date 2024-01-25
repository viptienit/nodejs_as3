const UserDB = require("../Model/UserDB");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { createJWT, verifyToken } = require("../middleware/CheckJWT");

// get all user
exports.getUser = (req, res, next) => {
  UserDB.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) =>
      res.status(401).json({ err: "lỗi server", message: err.message })
    );
};
// get  user theo id
exports.getUserId = (req, res, next) => {
  UserDB.find({ _id: req.params.id })
    .then((data) => {
      res.send(data);
    })
    .catch((err) =>
      res.status(401).json({ err: "lỗi server", message: err.message })
    );
};
// tao 1 user mowi
exports.addUser = (req, res, next) => {
  // mã hóa password
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(401).json({ err: "lỗi server", message: err.message });
    } else {
      // thêm user
      UserDB.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
        phone: req.body.phone,
        cart: [],
        role: "client",
      })
        .then((data) => {
          res.send(data);
        })
        .catch((err) =>
          res.status(401).json({ err: "lỗi server", message: err.message })
        );
    }
  });
};
// check user
exports.checkUser = (req, res, next) => {
  // tìm user
  UserDB.find({
    _id: req.body.id,
  })
    .then((data) => {
      // check password xem có đúng không
      bcrypt.compare(
        req.body.password,
        data[0].password,
        function (err, result) {
          if (err)
            // sai trả về mã lỗi
            res.status(401).json({ err: "lỗi server", message: err.message });
          if (result) {
            // đúng trả vê
            const token = createJWT({
              fullname: data[0].fullname,
              id: data[0]._id,
              cart: data[0].cart,
              role: data[0].role,
            });
            /// seet cookie client
            res.cookie("jwt", token, { httpOnly: true });
            // dữ liêu jtrar về
            return res.send({
              fullname: data[0].fullname,
              id: data[0]._id,
              cart: data[0].cart,
              token: token,
            });
          }
          if (!result)
            // trả về sai mật khẩu
            return res.status(401).json({
              err: "error password",
              message: " error password ",
            });
        }
      );
    })
    // trả lỗi server
    .catch((err) =>
      res.status(401).json({ err: "lỗi server", message: err.message })
    );
};
exports.checkAdmin = (req, res, next) => {
  UserDB.find({
    _id: req.body.id,
  })
    .then((data) => {
      bcrypt.compare(
        req.body.password,
        data[0].password,
        function (err, result) {
          if (err)
            res.status(401).json({ err: "lỗi server", message: err.message });
          if (result) {
            if (data[0].role === "admin" || data[0].role === "adviser") {
              const token = createJWT({
                id: data[0]._id,
                role: data[0].role,
              });
              /// seet cookie
              res.cookie("jwt", token, { httpOnly: true });

              return res.send({
                id: data[0]._id,
                role: data[0].role,
                token: token
              });
            } else {
              res.send("Bạn không phải là Admin hoặc Adviser");
            }
          }
          if (!result)
            return res.json({
              err: "error password",
              message: " error password ",
            });
        }
      );
    })
    .catch((err) =>
      res.status(401).json({ err: "lỗi server", message: err.message })
    );
};
exports.checkUserLoginAdmin = (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    const decoded = verifyToken(req.cookies.jwt);
    if (decoded) {
      res.cookie("jwt", req.cookies.jwt, {
        httpOnly: true,
      });
      res.send(decoded);
    } else {
      res.send({ message: "chua dang nhap" });
    }
  } else {
    res.send({ message: "chua dang nhap" });
  }
};
// logout user
exports.logoutUser = (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json("clear cookie");
};
// check user login
exports.checkUserLogin = (req, res, next) => {
  if ((req.cookies && req.cookies.jwt) || req.query.token) {
    const decoded = verifyToken(req.cookies.jwt || req.query.token);
    if (decoded) {
      res.cookie("jwt", req.cookies.jwt ? req.cookies.jwt : req.query.token, {
        httpOnly: true,
      });
      res.send(decoded);
    } else {
      res.send({ message: "chua dang nhap" });
    }
  } else {
    res.send({ message: "chua dang nhap" });
  }
};
// update cart user
exports.updateCartUser = (req, res, next) => {
  UserDB.updateOne(
    { _id: req.user.id },
    {
      cart: req.body,
    }
  )
    .then((data) => {
      // gửi lại token
      const token = createJWT({
        fullname: req.user.fullname,
        id: req.user.id,
        cart: req.body,
        role: req.user.role,
      });
      res.cookie("jwt", token, { httpOnly: true });
      res.send("uppdste thanhd coong");
    })
    .catch((err) =>
      res.status(401).json({ err: "lỗi server", message: err.message })
    );
};
// cập nhật người dùng
exports.updateUser = (req, res, next) => {
  if (req.user.role === "admin") {
    UserDB.updateOne(
      { _id: req.body.id },
      {
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        phone: req.body.phone,
      }
    )
      .then(() => {
        res.send("đã update user thành công");
      })
      .catch((err) => res.send({ err: "err", message: err.message }));
  } else {
    res.send({ err: "err", message: "bạn không phải admin" });
  }
};
// xóa người dùng
exports.deleteUser = (req, res, next) => {
  if (req.user.role === "admin") {
    UserDB.deleteOne({ _id: req.params.id })
      .then(() => {
        res.send("đã delete user thành công");
      })
      .catch((err) => res.send({ err: "err", message: err.message }));
  } else {
    res.send({ err: "err", message: "bạn không phải admin" });
  }
};
