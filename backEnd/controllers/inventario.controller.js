/**
 * Se coloca el controlador como un objeto y luego se exporta como
 * Se requiere primero el modelo empleado
 **/

const Inventario = require("../models/inventario"); // Se importa el modelo de la base de datos
const inventarioCtrl = {}; // Se crea un objeto vacío para el controlador

// DEFINO LOS MÉTODOS
// Obtener todo el inventario
inventarioCtrl.getInventario = async (req, res) => {
  const inventario = await Inventario.find(); // Se busca todo el inventario en la base de datos
  res.json(inventario); // Se envía el inventario como respuesta
};

// Crear un nuevo producto
inventarioCtrl.createInventario = async (req, res) => {
  const inventario = new Inventario(req.body); // Se crea un nuevo producto con los datos enviados en el cuerpo de la solicitud
  await inventario.save(); // Se guarda el producto en la base de datos
  res.json({
    status: "Producto guardado",
  }); // Se envía una respuesta indicando que el producto fue guardado
};

// Conseguir un producto por ID
inventarioCtrl.getInventarioId = async (req, res) => {
  const inventario = await Inventario.findById(req.params.id); // Se busca el producto por su ID
  res.json(inventario); // Se envía el producto como respuesta
};

// Editar un producto por ID
inventarioCtrl.updateInventario = async (req, res) => {
  const { id } = req.params; // Se obtiene el ID del producto a actualizar
  const inventarioEdit = {
    // Se crea un objeto con los datos a actualizar
    producto: req.body.producto,
    codeProducto: req.body.codeProducto,
    marca: req.body.marca,
    categoria: req.body.categoria,
    precio: req.body.precio,
    stock: req.body.stock,
  }

  await Inventario.findByIdAndUpdate(id, { $set: inventarioEdit }, { new: true }); // Se busca el producto por su ID y se actualiza con los nuevos datos
  
  res.json({status: 'Producto Actualizado'});; // Se envía el producto actualizado como respuesta
};

// Eliminar un producto por ID
inventarioCtrl.deleteInventario = async (req, res) => {
  await Inventario.findByIdAndDelete(req.params.id); // Se busca y elimina el producto por su ID
  res.json({ status: "Producto eliminado" }); // Se envía una respuesta indicando que el producto fue eliminado
};

// Exportar el controlador
module.exports = inventarioCtrl; // Se exporta el controlador para que pueda ser utilizado en otros archivos
