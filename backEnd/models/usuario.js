const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  usuario: String,
  password: String
});

module.exports = mongoose.model("Usuario", usuarioSchema);
