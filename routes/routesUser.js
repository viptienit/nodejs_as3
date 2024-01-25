const express = require("express");
const router = express.Router();
const {
  getUser,
  addUser,
  checkUser,
  checkUserLogin,
  logoutUser,
  updateCartUser,
  checkAdmin,
  checkUserLoginAdmin,
  getUserId,
  updateUser,
  deleteUser,
} = require("../controller/user");
const { checkUserJWT } = require("../middleware/CheckJWT");
// logout user
router.delete("/logout", logoutUser);

//check đăng nhập của admin và adviser, client ko đăng nhập được
router.post("/checkadmin", checkAdmin);
// check Đăng nhập(cả admin và adviser đều đăng nhập được)
router.post("/checkuser", checkUser);

// get user theo id
router.get("/id/:id", getUserId);

// kiểm tra ban đầu xem người dùng đã login trk đó hay chưa
router.get("/checklogin", checkUserLogin);
// kiểm tra ban đầu xem người dùng đã login trk đó hay chưa
router.get("/checkloginadmin", checkUserLoginAdmin);
// update cart user Mỗi lần thêm sản phẩm vào giỏ hàng đều check login
router.put("/updateCart", checkUserJWT, updateCartUser);
// Admin update user
router.put("/updateUser", checkUserJWT, updateUser);
// Admin delete user
router.delete("/deleteUser/:id", checkUserJWT, deleteUser);
// get all user
router.get("/", getUser);
// add user
router.post("/", addUser);
module.exports = router;
