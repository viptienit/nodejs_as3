const SessionDB = require("../Model/SessionDB");

exports.getSession = (req, res, next) => {
  if (req.query.room) {
    SessionDB.find({ roomId: req.query.room })
      .then((data) => res.send(data[0] ? data[0] : false))
      .catch("looix server");
  } else {
    SessionDB.find({})
      .then((data) => res.send(data))
      .catch("looix server");
  }
};
