// reset.js
document
  .getElementById("reset-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMessage = document.getElementById("error-message");
    const modalOverlay = document.getElementById("success-modal-overlay"); // Pega o overlay do modal

    errorMessage.style.display = "none";

    if (newPassword === "" || confirmPassword === "") {
      errorMessage.textContent =
        "Por favor, preencha ambos os campos de senha.";
      errorMessage.style.display = "block";
      return;
    }

    if (newPassword !== confirmPassword) {
      errorMessage.textContent = "As senhas não coincidem. Tente novamente.";
      errorMessage.style.display = "block";
      return;
    }

    if (newPassword.length < 8) {
      errorMessage.textContent = "A senha deve ter pelo menos 8 caracteres.";
      errorMessage.style.display = "block";
      return;
    }

    // Se tudo estiver correto, mostra o modal
    console.log("Senha redefinida com sucesso!");

    // Altera o display do overlay para 'flex' para ativá-lo
    modalOverlay.style.display = "flex";

    // Limpa os campos do formulário
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
  });
