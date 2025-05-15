const filasPorPagina = 10;
let datos = [];
let paginaActual = 1;
let editandoId = null;
let idProductoAEliminar = null;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoriaParam = urlParams.get("categoria");

  if (categoriaParam) {
    document.getElementById(
      "titulo-categoria"
    ).textContent = `Productos de la categoría: ${categoriaParam}`;
  }

  document.getElementById("anterior").addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      mostrarPagina();
    }
  });

  document.getElementById("siguiente").addEventListener("click", () => {
    const totalPaginas = Math.ceil(datos.length / filasPorPagina);
    if (paginaActual < totalPaginas) {
      paginaActual++;
      mostrarPagina();
    }
  });

  cargarProductos(); // Mostrar productos al cargar la página
  inicializarEventos();
});

function inicializarEventos() {
  // Confirmar eliminación
  document
    .getElementById("confirmar-eliminar")
    .addEventListener("click", async () => {
      if (!idProductoAEliminar) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/productos/${idProductoAEliminar}`,
          { method: "DELETE" }
        );

        console.log("Código de estado:", response.status); // <- Verifica si es 204

        if (!response.ok) {
          // Si hay error, intenta obtener mensaje, pero sin forzar .json()
          let errorMsg = "Error al eliminar";
          try {
            const result = await response.json();
            errorMsg = result.error || errorMsg;
          } catch (e) {
            // Nada que hacer si no hay JSON
          }
          throw new Error(errorMsg);
        }

        // ✅ Si llega aquí, todo fue bien
        alert("Producto eliminado correctamente.");

        // 🔄 Recargar tabla
        await cargarProductos().then(() => {
          document.getElementById("modal-eliminar").style.display = "none";
          idProductoAEliminar = null; // Reiniciar ID de producto a eliminar
        }).catch((error) => {
          console.error("Error al recargar productos:", error);
          alert("Producto eliminado, pero ocurrió un error al actualizar la tabla.");
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert(error.message || "Error al eliminar el producto.");
      }
    });
}

// Función para mostrar el modal
function mostrarModalEliminar(id) {
  idProductoAEliminar = id;
  const producto = datos.find((d) => d._id === id);
  const textoEliminar = document.getElementById("texto-eliminar");

  textoEliminar.innerHTML = producto
    ? `¿Estás seguro de que deseas eliminar <strong>${producto.producto}</strong>?`
    : "¿Estás seguro de que deseas eliminar este producto?";

  document.getElementById("modal-eliminar").style.display = "flex";
}

// Función para editar
function editarProducto(producto) {
  localStorage.setItem("productoEditar", JSON.stringify(producto));
  window.location.href = "AgregarProducto.html";
}

// Función para cargar y mostrar productos
async function cargarProductos() {
  try {
    const response = await fetch("http://localhost:3000/api/productos");
    const todosLosProductos = await response.json();

    const urlParams = new URLSearchParams(window.location.search);
    const categoriaParam = urlParams.get("categoria");

    // Filtrar productos por categoría si hay parámetro
    datos = categoriaParam
      ? todosLosProductos.filter((p) => p.categoria === categoriaParam)
      : todosLosProductos;

    const irUltima = urlParams.get("pagina") === "ultima";
    const totalPaginas = Math.ceil(datos.length / filasPorPagina);
    paginaActual = irUltima ? totalPaginas : 1;

    mostrarPagina();
  } catch (error) {
    console.error("Error al cargar productos:", error);
    alert("Error al cargar productos.");
  }
}

// Mostrar la paginación con números
function mostrarNumerosPagina() {
  const totalPaginas = Math.ceil(datos.length / filasPorPagina);
  const contenedorNumeros = document.getElementById("numeros-pagina");
  contenedorNumeros.innerHTML = ""; // Limpiar la paginación actual

  for (let i = 1; i <= totalPaginas; i++) {
    const botonPagina = document.createElement("button");
    botonPagina.textContent = i;
    botonPagina.className = "btn-pagina";
    botonPagina.addEventListener("click", () => {
      paginaActual = i;
      mostrarPagina();
    });

    // Destacar la página activa
    if (i === paginaActual) {
      botonPagina.classList.add("activo");
    }

    contenedorNumeros.appendChild(botonPagina);
  }
}

function mostrarPagina() {
  const tablaBody = document.querySelector("#tabla-productos tbody");
  tablaBody.innerHTML = "";

  const totalPaginas = Math.ceil(datos.length / filasPorPagina);
  const inicio = (paginaActual - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;

  const productosPagina = datos.slice(inicio, fin);

  productosPagina.forEach((prod) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${prod._id}</td>
      <td>${prod.producto}</td>
      <td>${prod.codigo}</td>
      <td>${prod.marca}</td>
      <td>${prod.categoria}</td>
      <td>${prod.stock}</td>
      <td>${new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(prod.precio)}</td>

    `;

    const accionesTd = document.createElement("td");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.className = "btn-edit";
    btnEditar.addEventListener("click", () => editarProducto(prod));

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn-delete";
    btnEliminar.addEventListener("click", () => mostrarModalEliminar(prod._id));

    accionesTd.appendChild(btnEditar);
    accionesTd.appendChild(btnEliminar);

    fila.appendChild(accionesTd);
    tablaBody.appendChild(fila);
  });

  // Actualizar número de página y estado de botones
  document.getElementById("anterior").disabled = paginaActual === 1;
  document.getElementById("siguiente").disabled = paginaActual === totalPaginas;

  mostrarNumerosPagina(); // Mostrar los números de página
}