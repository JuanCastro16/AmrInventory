const filasPorPagina = 10;
let datos = JSON.parse(localStorage.getItem("productos")) || [];
let paginaActual = 1;
let editandoId = null;

function agregarFila() {
  const producto = document.getElementById("producto").value;
  const codigo = document.getElementById("codigo").value;
  const marca = document.getElementById("marca").value;
  const categoria = document.getElementById("categoria").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;

  if (producto && codigo && marca && precio && stock) {
    if (editandoId !== null) {
      const index = datos.findIndex((d) => d.id === editandoId);
      datos[index] = {
        id: editandoId,
        producto,
        codigo,
        marca,
        categoria,
        precio,
        stock,
      };
      editandoId = null;
    } else {
      datos.push({
        id: datos.length ? datos[datos.length - 1].id + 1 : 1,
        producto,
        codigo,
        marca,
        categoria,
        precio,
        stock,
      });
    }

    localStorage.setItem("productos", JSON.stringify(datos));
    document
      .querySelectorAll(".form-inputs input")
      .forEach((input) => (input.value = ""));
    mostrarTabla();
  } else {
    alert("Por favor complete todos los campos.");
  }
}

function mostrarTabla() {
  const inicio = (paginaActual - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  const datosPagina = datos.slice(inicio, fin);

  const tbody = document.getElementById("tabla-body");
  tbody.innerHTML = "";

  datosPagina.forEach((d) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${d.id}</td>
      <td>${d.producto}</td>
      <td>${d.codigo}</td>
      <td>${d.marca}</td>
      <td>${d.categoria}</td>
      <td>${d.precio}</td>
      <td>${d.stock}</td>
      <td>
        <button class="btn btn-edit" onclick="editarProducto(${d.id})">Editar</button>
        <button class="btn btn-delete" onclick="eliminarFila(${d.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  document.getElementById(
    "pagina-actual"
  ).textContent = `Página ${paginaActual}`;
}

function cambiarPagina(direccion) {
  const totalPaginas = Math.ceil(datos.length / filasPorPagina);
  paginaActual += direccion;
  if (paginaActual < 1) paginaActual = 1;
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;
  mostrarTabla();
}

function editarProducto(id) {
  const productoEditar = datos.find((d) => d.id === id);
  if (productoEditar) {
    localStorage.setItem("productoEditar", JSON.stringify(productoEditar));
    window.location.href = "AgregarProducto.html";
  }
}

function eliminarFila(id) {
  if (confirm("¿Seguro que deseas eliminar este producto?")) {
    datos = datos.filter((d) => d.id !== id);
    localStorage.setItem("productos", JSON.stringify(datos));
    if ((paginaActual - 1) * filasPorPagina >= datos.length) {
      paginaActual = Math.max(paginaActual - 1, 1);
    }
    mostrarTabla();
  }
}

// Evento al cambiar el tamaño de pantalla
window.addEventListener("resize", () => {
  updateItemsPerPage();
});

// Inicialización
window.addEventListener("load", () => {
  updateItemsPerPage();
});

document.addEventListener("DOMContentLoaded", mostrarTabla);

let idProductoAEliminar = null;

function eliminarFila(id) {
  idProductoAEliminar = id;
  const producto = datos.find((d) => d.id === id);
  const textoEliminar = document.getElementById("texto-eliminar");

  if (producto) {
    textoEliminar.innerHTML = `¿Estás seguro de que deseas eliminar <strong>${producto.producto}</strong>?`;
  } else {
    textoEliminar.textContent =
      "¿Estás seguro de que deseas eliminar este producto?";
  }

  document.getElementById("modal-eliminar").style.display = "flex";
}

document.getElementById("confirmar-eliminar").addEventListener("click", () => {
  datos = datos.filter((d) => d.id !== idProductoAEliminar);
  localStorage.setItem("productos", JSON.stringify(datos));
  if ((paginaActual - 1) * filasPorPagina >= datos.length) {
    paginaActual = Math.max(paginaActual - 1, 1);
  }
  mostrarTabla();
  document.getElementById("modal-eliminar").style.display = "none";
});

document.getElementById("cancelar-eliminar").addEventListener("click", () => {
  document.getElementById("modal-eliminar").style.display = "none";
});

window.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-eliminar");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
