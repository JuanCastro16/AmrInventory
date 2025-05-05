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
    localStorage.setItem("editandoId", productoEditar.id);
  }
});

document
  .getElementById("form-producto")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const producto = document.getElementById("producto").value;
    const codigo = document.getElementById("codigo").value;
    const marca = document.getElementById("marca").value;
    const categoria = document.getElementById("categoria").value;
    const stock = document.getElementById("stock").value;
    const precio = document.getElementById("precio").value;

    const datos = JSON.parse(localStorage.getItem("productos")) || [];
    const editandoId = parseInt(localStorage.getItem("editandoId"));

    if (!producto || !codigo || !marca || !categoria || !stock || !precio) {
      alert("Por favor complete todos los campos.");
      return;
    }

    if (editandoId) {
      const index = datos.findIndex((d) => d.id === editandoId);
      if (index !== -1) {
        datos[index] = {
          id: editandoId,
          producto,
          codigo,
          marca,
          categoria,
          stock,
          precio,
        };
      }
    } else {
      datos.push({
        id: datos.length ? datos[datos.length - 1].id + 1 : 1,
        producto,
        codigo,
        marca,
        categoria,
        stock,
        precio,
      });
    }

    localStorage.setItem("productos", JSON.stringify(datos));
    document.getElementById("form-producto").reset();
    localStorage.removeItem("productoEditar");
    localStorage.removeItem("editandoId");

    // Mensaje de éxito
    document.getElementById("mensaje-exito").style.display = "block";
    setTimeout(() => {}, 3000);
  });

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
