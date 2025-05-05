const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express(); // la constante app tendrá ahora todo el funcionamiento del servidor

const mongoose = require("./dataBase"); // no se quiere todo el archivo sino la conexión

/** * Se crea una REST API, es la manera de decirle al servidor que reciba y envíe datos */

// Configuraciones
app.set("port", process.env.PORT || 3000); // Se establece el puerto por defecto o el 3000
app.use(morgan("dev")); // Se establece el formato de los logs

app.use(express.json()); // método que ayuda a convertir el código para que el servidor pueda entender lo que viene del cliente.

app.use(cors({ origin: "http://localhost:4200" })); // método para comunicar con el cliente

// rutas de nuestro servidor
app.use("/api/inventario", require("./routes/inventario.route")); // Se establece la ruta de la API, se le dice que use el archivo inventario.routes.js

app.listen(app.get("port"), () => {
  // esta es una mejor manera de configurar el puerto

  console.log("Server activo en el puerto", app.get("port")); // Se establece el mensaje que se mostrará en la consola cuando el servidor esté corriendo
});
