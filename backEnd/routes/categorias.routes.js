const express = require("express");
const router = express.Router();
const Categoria = require("../models/Categoria");

// GET /api/categorias
router.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias); // <- debe devolver [{ _id, nombre }, ...]
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener categorías" });
  }
});

module.exports = router;
