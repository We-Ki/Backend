const mongoose = require("mongoose");

const waterSchema = mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farm",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    wateredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Water = mongoose.model("water", waterSchema);
module.exports = Water;
