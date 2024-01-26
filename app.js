const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const cookieParser = require("cookie-parser");
const RouterOrder = require("./routes/routesOrder");
const RouterProduct = require("./routes/routesProduct");
const RouterSession = require("./routes/routesSession");
const RouterUser = require("./routes/routesUser");
const multer = require("multer");
const SessionDB = require("./Model/SessionDB");
const cors = require("cors");
const path = require("path");
const socket = require("socket.io");
const http = require("http");
const server = http.Server(app);
require("dotenv").config();
const originC = process.env.CLIENT_URL;
const originA = process.env.ADMIN_URL;

// import socket io
const io = socket(server, {
  cors: {
    origin: ['https://admin2-ass3.web.app','http://localhost:3001', originC],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: ['https://admin2-ass3.web.app','http://localhost:3001', originC],
    credentials: true,
  })
);

// coookie parser
app.use(cookieParser());
// lấy links lưu thư mục và cách lưu tên file
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      (Math.random() * 10000000).toFixed(0).toString() + "-" + file.originalname
    );
  },
});
// kiểm tra xem có phải ảnh hay không
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// dùng midlerware để lấy dữ liệu ảnh và lưu vào file ảnh
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("image", 5)
);
// khi truy xuấy ảnh bằng server
app.use(express.static(path.join(__dirname, "/")));
// express router
app.use("/order", RouterOrder);
app.use("/product", RouterProduct);
app.use("/session", RouterSession);
app.use("/user", RouterUser);
server.listen(5000);

io.on("connection", (socket) => {
  // có người tạo phòng
  socket.on("tao-phong", (data) => {
    // xóa hết các phòng cũ khi người dùng tạo phòng mới
    const rooms = socket.rooms;
    for (const room of rooms) {
      console.log(room);
      // xóa mongooes
      SessionDB.deleteOne({ roomId: room })
        .then((data) => console.log("thanh cong"))
        .catch((err) => console.log(err));
      // rời phòng
      socket.leave(room);
    }
    // theem nguowif dunghf vaof phongs mowis
    socket.join(data.room);
    // guwir duw liệu đầu tiên khi tạo phòng
    SessionDB.create({ roomId: data.room, messages: data.message })
      .then((ss) =>
        SessionDB.find({})
          // trả về tất cả các phòng
          .then((ss) => io.sockets.emit("c-tao-phong", ss))
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
  });
  // khi có người vào phòng
  socket.on("vao-phong", (data) => {
    // xóa hết sự có mặt khi người dùng vào phòng mới
    const rooms = socket.rooms;
    for (const room of rooms) {
      socket.leave(room);
    }
    // thêm người dùng vào phòng mới
    socket.join(data);
    // gửi tin nhắn cũ cho người mới vào
    SessionDB.find({ roomId: data })
      .then((ss) => io.sockets.emit("vao-phong", ss))
      .catch((err) => console.log(err));
  });
  // client và admin chát với nhau thì cập nhật trên mongo
  socket.on("send-admin", (data) => {
    SessionDB.updateOne({ roomId: data.room }, { messages: data.messages })
      .then((data) => console.log(data))
      .catch((err) => console.log("loi server"));
    // gửi tất cả nguồi trong phòng đó
    io.in(data.room).emit(data.room, data.messages);
  });
  // danh sách phòng
  socket.on("danh-sach-phong", (data) => {
    SessionDB.find({})
      // trả về tất cả các phòng
      .then((ss) => socket.emit("danh-sach-phong", ss))
      .catch((err) => console.log(err));
  });
  // khi người dùng end room
  socket.on("end-room", (data) => {
    const rooms = socket.rooms;
    for (const room of rooms) {
      // xóa phòng trên moggo
      SessionDB.deleteOne({ roomId: room })
        .then((data) => console.log("thanh cong"))
        .catch((err) => console.log(err));
      // rời phòng
      socket.leave(room);
    }

    SessionDB.find({})
      // trả về tất cả các phòng
      .then((ss) => io.sockets.emit("c-end-phong", ss))
      .catch((err) => console.log(err));
  });
});
app.get("/", (req, res) => {
  res.send("server");
});
