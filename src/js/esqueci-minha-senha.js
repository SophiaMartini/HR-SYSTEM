// script.js
document
  .getElementById("recovery-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const emailInput = document.getElementById("email");
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message"); // Pega o elemento de sucesso
    const email = emailInput.value;

    // Expressão regular simples para validar e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Esconde as mensagens antes de validar novamente
    errorMessage.style.display = "none";
    successMessage.style.display = "none";

    if (emailRegex.test(email)) {
      // Se o e-mail for válido
      successMessage.style.display = "block"; // Mostra a mensagem de sucesso
      emailInput.value = ""; // Limpa o campo de e-mail

      // Opcional: Esconde a mensagem após alguns segundos
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 5000); // A mensagem desaparecerá após 5 segundos
    } else {
      // Se o e-mail for inválido
      errorMessage.textContent = "Por favor, insira um e-mail válido.";
      errorMessage.style.display = "block"; // Mostra a mensagem de erro
    }
  });
