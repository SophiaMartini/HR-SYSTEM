document.addEventListener("DOMContentLoaded", () => {
  const cpfInput = document.getElementById("cpf");
  const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .slice(0, 14);
    };
  
    cpfInput.addEventListener('input', (e) => e.target.value = maskCPF(e.target.value));

  const form = document.getElementById("login-form");
  
  // Elementos de visualização de senha (opcional)
  const togglePassword = document.getElementById("togglePassword");
  const senhaInput = document.getElementById("senha");
  
  if (togglePassword && senhaInput) {
    togglePassword.addEventListener("click", () => {
      const type = senhaInput.getAttribute("type") === "password" ? "text" : "password";
      senhaInput.setAttribute("type", type);
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

  form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // remove máscara do CPF
  const cpfLimpo = cpfInput.value.replace(/\D/g, "");

  const data = {
    cpf: cpfLimpo,
    senha: senhaInput.value.trim(),
  };

  if (!data.cpf || !data.senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Falha no login.");
    }

    alert("Login realizado com sucesso!");

    // Redirecionar baseado no tipo de usuário
    switch (result.tipo) {
      case "interno":
        window.location.href = "dashboard-interno.html";
        break;
      case "candidato":
        window.location.href = "dashboard-candidato.html";
        break;
      case "colaborador":
        window.location.href = "dashboard-colaborador.html";
        break;
      default:
        alert("Tipo de usuário inválido");
    }

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Erro: " + error.message);
  }
});
});