document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/categorias")
    .then((res) => res.json())
    .then((categorias) => {
      const select = document.getElementById("categoria");
      categorias.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.nombre; // Asegúrate que tu modelo tiene este campo
        option.textContent = cat.nombre;
        select.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error al cargar categorías desde el backend:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("productoEditar")) {
    localStorage.removeItem("editandoId");
  }

  const productoEditar = JSON.parse(localStorage.getItem("productoEditar"));

  if (productoEditar) {
    document.getElementById("producto").value = productoEditar.producto;
    document.getElementById("codigo").value = productoEditar.codigo;
    document.getElementById("marca").value = productoEditar.marca;
    document.getElementById("categoria").value = productoEditar.categoria;
    document.getElementById("stock").value = productoEditar.stock;
    document.getElementById("precio").value = productoEditar.precio;

    // Cambia el texto del botón
    document.getElementById("titulo-formulario").textContent =
      "Editar Producto";
    document.querySelector("form button[type='submit']").textContent =
      "Guardar Cambios";

    // Guardamos el ID que se está editando en localStorage
    localStorage.setItem("editandoId", productoEditar._id);
  }
});



document
  .getElementById("form-producto")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const producto = document.getElementById("producto").value;
    const codigo = document.getElementById("codigo").value;
    const marca = document.getElementById("marca").value;
    const categoria = document.getElementById("categoria").value;
    const stock = document.getElementById("stock").value;
    const precio = document.getElementById("precio").value;

    //const datos = JSON.parse(localStorage.getItem("productos")) || [];
    //const editandoId = parseInt(localStorage.getItem("editandoId"));
    const editandoId = localStorage.getItem("editandoId");

    const campos = [
      { id: "producto", valor: producto },
      { id: "codigo", valor: codigo },
      { id: "marca", valor: marca },
      { id: "categoria", valor: categoria },
      { id: "stock", valor: stock },
      { id: "precio", valor: precio },
    ];

    let camposValidos = true;

    campos.forEach(({ id, valor }) => {
      const input = document.getElementById(id);
      if (!valor.trim()) {
        input.classList.add("input-error");
        camposValidos = false;
      } else {
        input.classList.remove("input-error");
      }
    });

    if (!camposValidos) {
      alert("Por favor complete todos los campos correctamente.");
      return;
    }

    const datosProducto = {
      producto,
      codigo,
      marca,
      categoria,
      stock,
      precio,
    };

    try {
      const loader = document.getElementById("loader");
      loader.classList.add("visible");

      if (editandoId) {
        // Actualizar producto en la base de datos
        const response = await fetch(
          `http://localhost:3000/api/productos/${editandoId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosProducto),
          }
        );
        await response.json();
      } else {
        // Crear nuevo producto en la base de datos
        const response = await fetch("http://localhost:3000/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosProducto),
        });
        await response.json();
      }

      document.getElementById("form-producto").reset();
      localStorage.removeItem("productoEditar");
      localStorage.removeItem("editandoId");
      // Mensaje de éxito
      document.getElementById("mensaje-exito").style.display = "block";
      setTimeout(() => {
        window.location.href = "main.html?pagina=ultima";
      }, 1000);
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Error al guardar el producto. Intente nuevamente.");
    } finally {
      loader.classList.remove("visible");
    }
  });

// Modal para cancelar la edición o creación de un producto
const modal = document.getElementById("modal-cancelar");
const btnCancelar = document.getElementById("btn-cancelar");
const btnConfirmar = document.getElementById("confirmar-cancelar");
const btnCerrar = document.getElementById("cerrar-modal");

btnCancelar.addEventListener("click", () => {
  modal.style.display = "flex";
});

btnCerrar.addEventListener("click", () => {
  modal.style.display = "none";
});

btnConfirmar.addEventListener("click", () => {
  localStorage.removeItem("productoEditar");
  localStorage.removeItem("editandoId");
  window.location.href = "main.html";
});

// Cerrar modal si hacen clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
