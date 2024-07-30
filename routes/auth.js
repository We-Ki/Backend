const express = require("express");
const router = express.Router();
const User = require("../models/User");
const utils = require("../utils");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

//회원가입
router.post("/signup", (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.send({ success: true, message: user._id });
    })
    .catch((error) => {
      res.send({ success: false, message: utils.parseError(error) });
    });
});

//로그인
router.post("/signin", function (req, res, next) {
  var errors = {};
  var isValid = true;

  if (!req.body.username) {
    isValid = false;
    errors.username = "Username is required!";
  }
  if (!req.body.password) {
    isValid = false;
    errors.password = "Password is required!";
  }

  if (isValid) {
    return passport.authenticate(
      "local",
      {
        session: false,
      },
      (err, user) => {
        if (!user) {
          return res.send({
            success: false,
            message: "Incorrect Username or Password",
          });
        }
        req.login(user, { session: false }, (err) => {
          if (err) {
            res.send(err);
          }
          // jwt.sign('token내용', 'JWT secretkey')
          const token = jwt.sign({ id: user._id }, process.env.SECREAT_KEY);
          return res.send({
            success: true,
            message: { token },
          });
        });
      }
    )(req, res, next);
  } else {
    req.flash("errors", errors);
    res.redirect("/login");
  }
});

module.exports = router;
