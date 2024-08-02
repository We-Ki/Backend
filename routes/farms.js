const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const util = require("../utils");

const Farm = require("../models/Farm");
const Water = require("../models/Water");
const User = require("../models/User");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Farm.find({})
      .populate("farmer")
      .then((farms) => {
        res.send({ success: true, message: farms });
      })
      .catch((error) => {
        res.send({ success: false, message: utils.parseError(error) });
      });
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.body.farmer = req.user._id;
    Farm.create(req.body)
      .then((farm) => {
        return res.send({ success: false, message: farm._id });
      })
      .catch((err) => {
        return res.send({ success: false, message: util.parseError(err) });
      });
  }
);

router.post(
  "/water/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.body.farm = req.params.id;
    User.findByIdAndUpdate(req.user._id, { $inc: { point: 10 } })
      .then((user) => {
        console.log(user);
        req.body.user = user._id;
        return Water.create(req.body);
      })
      .then((water) => {
        console.log(water);
        return res.send({ success: true, message: water._id });
      })
      .catch((err) => {
        return res.send({ success: false, message: util.parseError(err) });
      });
  }
);
module.exports = router;
