const mongoose = require("mongoose");
const {Schema} = mongoose; // Se importa el esquema de mongoose para crear el modelo de la base de datos

const InventarioSchema =new Schema({
    id : {type: String, required: false}, // Se establece el id del producto como un campo requerido
    producto: {type: String, required: true}, // Se establece el nombre del producto como un campo requerido
    codeProducto: {type: Number, required: true}, // Se establece el código del producto como un campo requerido
    marca : {type: String, required: true}, // Se establece la marca del producto como un campo requerido
    categoria: {type: String, required: true}, // Se establece la categoría del producto como un campo requerido
    precio: {type: Number, required: true}, // Se establece el precio del producto como un campo requerido
    stock: {type: Number, required: true}, // Se establece la cantidad del producto como un campo requerido
    fechaCreacion: {type: Date, default: Date.now} // Se establece la fecha de creación del producto como un campo por defecto
});

module.exports = mongoose.model("Inventario", InventarioSchema); // Se exporta el modelo de la base de datos para que pueda ser utilizado en otros archivos