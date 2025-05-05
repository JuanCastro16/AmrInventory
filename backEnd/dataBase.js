const mongoose = require("mongoose");
const URI = "mongodb://localhost/inventario"; // Se establece la URI de la base de datos, en este caso es local

mongoose.connect(URI)

  .then(db => console.log("Base de datos conectada")) // Se establece el mensaje que se mostrará en la consola cuando la base de datos esté conectada
  
  .catch(err => console.log(err)); // Se establece el mensaje que se mostrará en la consola cuando la base de datos no esté conectada

module.exports = mongoose; // Se exporta la conexión de la base de datos para que pueda ser utilizada en otros archivos
