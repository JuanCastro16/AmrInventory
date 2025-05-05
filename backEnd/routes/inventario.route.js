/**
* creamos un módulo por eso utilizamos express
*/
const express = require("express");
const router = express.Router();
const inventarioCtrl = require("../controllers/inventario.controller"); // Se importa el controlador de la base de datos

// Rutas de Inventario de la API
router.get("/", inventarioCtrl.getInventario); // Se establece la ruta para obtener todo el inventario
router.post("/", inventarioCtrl.createInventario); // Se establece la ruta para crear un nuevo producto
router.get("/:id", inventarioCtrl.getInventarioId); // Se establece la ruta para obtener un producto por su ID
router.put("/:id", inventarioCtrl.updateInventario); // Se establece la ruta para actualizar un producto por su ID
router.delete("/:id", inventarioCtrl.deleteInventario); // Se establece la ruta para eliminar un producto por su ID

module.exports = router;
