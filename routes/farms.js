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
    Farm.find({ users: req.user._id })
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
    if (req.user.userGroup === "farmer") {
      Farm.create(req.body)
        .then((farm) => {
          return res.send({ success: true, message: farm._id });
        })
        .catch((err) => {
          return res.send({ success: false, message: util.parseError(err) });
        });
    } else {
      return res.send({
        success: false,
        message: "Only farmer can create farm",
      });
    }
  }
);

router.post(
  "/:id/water",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.body.farm = req.params.id;
    Farm.findById(req.params.id)
      .populate("users")
      .then((farm) => {
        if (farm.users.some((user) => user._id == req.user.id)) {
          req.body.user = req.user._id;
          return Water.create(req.body);
        }
        return res.send({
          success: false,
          message: "You can only water where you joined in",
        });
      })
      .then(async (water) => {
        await User.findByIdAndUpdate(req.user._id, { $inc: { point: 10 } });
        return res.send({ success: true, message: water._id });
      })
      .catch((err) => {
        return res.send({ success: false, message: util.parseError(err) });
      });
  }
);

router.post(
  "/:id/join",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Farm.findById(req.params.id)
      .then(async (farm) => {
        if (farm.farmer != req.user.id) {
          farm.users.push(req.user._id);
          await farm.save();
          return res.send({ success: true, message: farm.users });
        }
        return res.send({ success: false, message: "Cannot join my Farm" });
      })
      .catch((err) => {
        return res.send({ success: false, message: util.parseError(err) });
      });
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Farm.findById(req.params.id)
      .populate("farmer")
      .then((farm) => {
        res.send({ success: true, message: farm });
      })
      .catch((error) => {
        res.send({ success: false, message: utils.parseError(error) });
      });
  }
);
module.exports = router;
