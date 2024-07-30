const express = require("express");
const router = express.Router();
const User = require("../models/User");
const utils = require("../utils");
const passport = require("../config/passport");
//모든 사용자 조회
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find({})
      .sort({ username: 1 })
      .then((users) => {
        res.send({ success: true, message: users });
      })
      .catch((error) => {
        res.send({ success: false, message: utils.parseError(error) });
      });
  }
);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({ success: true, message: req.user });
  }
);

//username을 가진 사용자 검색
router.get("/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (!user)
        return res.send({ success: false, message: "Cannot found User" });
      res.send({ success: true, message: user });
    })
    .catch((error) => {
      res.send({ success: false, message: utils.parseError(error) });
    });
});

//username을 가진 사용자의 정보를 수정
router.put("/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .select("password")
    .then((user) => {
      user.originalPassword = user.password;
      user.password = req.body.newPassword
        ? req.body.newPassword
        : user.password;
      for (var p in req.body) {
        user[p] = req.body[p];
      }
      user
        .save()
        .then((user) => {
          res.send({ success: true, message: user });
        })
        .catch((err) => {
          res.send({ success: false, message: utils.parseError(err) });
        });
    })
    .catch((err) => {
      res.send({ success: false, message: utils.parseError(err) });
    });
});

//username을 가진 사용자의 정보를 제거
router.delete(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.username != req.params.username) {
      return res.send({ success: false, message: "Cannot delete other user" });
    }
    User.deleteOne({ username: req.params.username })
      .then((result) => {
        if (!result.deletedCount)
          return res.send({
            success: false,
            message: `Cannot find User ${req.params.username}`,
          });
        res.send({
          success: true,
          message: `Delete user ${req.params.username} Success`,
        });
      })
      .catch((err) => {
        return res.send({ success: false, message: utils.parseError(err) });
      });
  }
);

module.exports = router;
