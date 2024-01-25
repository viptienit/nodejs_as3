const mongose = require("mongoose");
const Schema = mongose.Schema;
// lấy dữ liêu từ Database

mongose.connect(
  "mongodb+srv://loipnfx21822:ofZtiyYYJiWmtEvI@cluster0.ditdx9c.mongodb.net/Ass3",
  {
    useNewParser: true,
    useUniFiedTopology: true,
  }
);
const products = new Schema(
  {
    category: String,
    img1: String,
    img2: String,
    img3: String,
    img4: String,
    long_desc: String,
    name: String,
    price: Number,
    short_desc: String,
    sl: Number,
  },
  { collection: "Products" }
);
const ProductModel = mongose.model("products", products);
module.exports = ProductModel;
