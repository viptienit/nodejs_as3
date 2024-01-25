const express = require("express");
const router = express.Router();
const {
  getProduts,
  getProdutId,
  postProduct,
  getProductPagination,
  updateProduct,
  deleteProduct,
} = require("../controller/product");
const { checkUserJWT } = require("../middleware/CheckJWT");
//tìm kiếm theo category
router.get("/pagination", getProductPagination);
// tìm kiếm product theo id
router.get("/:id", getProdutId);
//update product  & kiểm tra xem có phải admin ko
router.put("/:id", checkUserJWT, updateProduct);
//xóa product  & kiểm tra xem có phải admin ko
router.delete("/:id", checkUserJWT, deleteProduct);
// tất cả  các products
router.get("/", getProduts);
//thêm product & kiểm tra xem có phải admin ko
router.post("/", checkUserJWT, postProduct);
module.exports = router;
