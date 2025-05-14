document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuarioInput = document.getElementById("usuario");
    const passwordInput = document.getElementById("password");

    // Limpia los estilos previos (si hay un borde rojo)
    usuarioInput.style.border = "";
    passwordInput.style.border = "";

    const usuario = usuarioInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Redirigir si login exitoso
        window.location.href = "main.html";
      } else {
        // Mostrar borde rojo si las credenciales son incorrectas
        usuarioInput.style.border = "2px solid red";
        passwordInput.style.border = "2px solid red";
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  });
});
