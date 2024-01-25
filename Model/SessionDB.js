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

const session = new Schema(
  {
    roomId: String,
    messages: [],
  },
  { collection: "Sessions" }
);
const SessionModel = mongoose.model("Sessions", session);
module.exports = SessionModel;
