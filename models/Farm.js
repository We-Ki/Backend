const mongoose = require("mongoose");

const farmSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

const Farm = mongoose.model("farm", farmSchema);
module.exports = Farm;
