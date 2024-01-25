const express = require("express");
const { checkUserJWT } = require("../middleware/CheckJWT");
const { orderUser, getOrderId, getAllOrder } = require("../controller/order");
const router = express.Router();
// tra tất xả đơn đặt hàng
router.get("/all", getAllOrder);
//tìm đơn đặt theo id
router.get("/", checkUserJWT, getOrderId);
//thêm đơn đặt hàng
router.post("/", checkUserJWT, orderUser);

module.exports = router;
