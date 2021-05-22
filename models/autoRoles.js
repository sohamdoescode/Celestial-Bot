const mongoose = require("mongoose");

let Schema = new mongoose.Schema({
  Roles: { type: Array, default: [] },
  Enbaled: { type: Boolean, default: true },
  Guild: { type: String, default: null },
});

module.exports = mongoose.model("autoRoles", Schema);
