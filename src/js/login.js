document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: form.email.value.trim(),
      senha: form.senha.value.trim(),
    };

    if (!data.email || !data.senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Falha no login.");
      }

      const result = await response.json();
      alert("Login realizado com sucesso!");

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro: " + error.message);
    }
  });
});
