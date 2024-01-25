const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// lấy dữ liêu từ Database

mongoose.connect(
  "mongodb+srv://loipnfx21822:ofZtiyYYJiWmtEvI@cluster0.ditdx9c.mongodb.net/Ass3",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const order = new Schema(
  {
    userId: String,
    email: String,
    fullname: String,
    phone: Number,
    address: String,
    cart: [],
    total: Number,
    time: Date,
    status: String,
  },
  { collection: "Orders" }
);
const OrderModel = mongoose.model("Orders", order);
module.exports = OrderModel;
