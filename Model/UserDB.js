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
const user = new Schema(
  {
    fullname: String,
    email: String,
    password: String,
    phone: String,
    cart: [],
    role: String,
  },
  { collection: "Users" }
);
const UserModel = mongoose.model("Users", user);
module.exports = UserModel;
