const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
require("dotenv").config();

var corsOptions = {
  origin: process.env.ORIGIN_URL,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var session = require("express-session");
var passport = require("./config/passport");

const app = express();

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open", function () {
  console.log("DB connected");
});
db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(passport.initialize());

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/farms", require("./routes/farms"));

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server on! http://localhost:" + port);
});
