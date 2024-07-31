const express = require("express");
const router = express.Router();
const Farm = require("../models/Farm");
const passport = require("../config/passport");
const util = require("../utils");

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

module.exports = router;
