document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");

  form.addEventListener("submit", (e) => {
      e.preventDefault();

      window.location.href = "main.html"; 
  });
});
