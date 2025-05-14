const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario"); // Importar el modelo de Usuario

router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const user = await Usuario.findOne({ usuario, password });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales inválidas" });
    }
    res
      .status(200)
      .json({ success: true, message: "Inicio de sesión exitoso", user });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

module.exports = router;
