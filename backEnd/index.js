const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/inventarios", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

// Middleware global
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Esquema y modelo de Producto
const productoSchema = new mongoose.Schema({
  producto: String,
  codigo: String,
  marca: String,
  categoria: String,
  stock: Number,
  precio: Number,
});

const Producto = mongoose.model("Producto", productoSchema);

// Rutas CRUD de productos

// Obtener todos los productos
app.get("/api/productos", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Agregar un nuevo producto
app.post("/api/productos", async (req, res) => {
  const { producto, codigo, marca, categoria, stock, precio } = req.body;
  try {
    const nuevoProducto = new Producto({
      producto,
      codigo,
      marca,
      categoria,
      stock,
      precio,
    });
    await nuevoProducto.save();
    res
      .status(201)
      .json({
        producto: nuevoProducto,
      });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

// Editar un producto
app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { producto, codigo, marca, categoria, stock, precio } = req.body;
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { producto, codigo, marca, categoria, stock, precio },
      { new: true }
    );
    res.json({
      producto: productoActualizado,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al editar el producto" });
  }
});

// Eliminar un producto
app.delete("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Producto.findByIdAndDelete(id);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

// Rutas de categorías
const categoriasRoutes = require("./routes/categorias.routes");
app.use("/api/categorias", categoriasRoutes);

// Rutas adicionales (autenticación, inventario)
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);
app.use("/api/inventario", require("./routes/inventario.route"));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
