document.addEventListener("DOMContentLoaded", () => {

  const redirecionamentos = {
    "vagas-btn": "/src/vagas.html",
    "treinamentos-btn": "/src/treinamentos.html",
    "perfil-btn": "/src/perfil.html",
    "departamentos-btn": "/src/departamentos.html",
    "colaboradores-btn": "/src/colaboradores.html",
    "folha-btn": "/src/folha.html"
  };

  Object.entries(redirecionamentos).forEach(([id, destino]) => {
    const botao = document.getElementById(id);
    if (botao) {
      botao.addEventListener("click", () => {
        window.location.href = destino;
      }, 1000);
    } else {
      console.warn(`Botão com ID "${id}" não encontrado no DOM.`);
    }
  });

});