const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const utils = require("../utils");
const mqtt = require("../config/mqtt");

const Farm = require("../models/Farm");
const Water = require("../models/Water");
const User = require("../models/User");

router.get(
  "/joined",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Farm.find({
      $or: [{ farmer: req.user._id }, { users: req.user._id }],
    })
      .populate("farmer")
      .then((farms) => {
        res.send({ success: true, message: farms });
      })
      .catch((error) => {
        res.send({ success: false, message: utils.parseError(error) });
      });
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Farm.find({
      $and: [
        { farmer: { $nin: req.user._id } },
        { users: { $nin: req.user._id } },
      ],
    })
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
          return res.send({ success: false, message: utils.parseError(err) });
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
        } else {
          res.send({
            success: false,
            message: "You can only water where you joined in",
          });
        }
      })
      .then(async (water) => {
        if (water) {
          await User.findByIdAndUpdate(req.user._id, { $inc: { point: 10 } });
          mqtt.publish(`${req.params.id}/water`, "true");
          return res.send({ success: true, message: water._id });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.send({ success: false, message: utils.parseError(err) });
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
          if (farm.users.indexOf(req.user._id) == -1)
            farm.users.push(req.user._id);
          else
            return res.send({ success: false, message: "Already joined farm" });
          await farm.save();
          return res.send({ success: true, message: farm.users });
        }
        return res.send({ success: false, message: "Cannot join my Farm" });
      })
      .catch((err) => {
        return res.send({ success: false, message: utils.parseError(err) });
      });
  }
);

router.delete(
  "/:id/join",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Farm.findById(req.params.id)
      .then(async (farm) => {
        if (farm.farmer != req.user.id) {
          if (farm.users.indexOf(req.user._id) == -1)
            return res.send({
              success: false,
              message: "Already Disjoined farm",
            });
          else farm.users.splice(farm.users.indexOf(req.user._id), 1);
          await farm.save();
          return res.send({ success: true, message: farm.users });
        }
        return res.send({ success: false, message: "Cannot join my Farm" });
      })
      .catch((err) => {
        return res.send({ success: false, message: utils.parseError(err) });
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

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Farm.findByIdAndDelete(req.params.id)
      .then((result) => {
        console.log(print);
        if (!result.deletedCount)
          return res.send({
            success: false,
            message: `Cannot find farm ${req.params.id}`,
          });
        return res.send({
          success: true,
          message: `Delete farm ${req.params.id} Success`,
        });
      })
      .catch((err) => {
        return res.send({ success: false, message: utils.parseError(err) });
      });
  }
);
module.exports = router;
