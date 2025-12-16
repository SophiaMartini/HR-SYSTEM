document.addEventListener('DOMContentLoaded', () => {

  function hideAllScreens() {
    document.querySelectorAll('[id$="-screen"]').forEach((screen) => {
      screen.style.display = "none";
    });
  }

  function showScreenByButtonId(btnId) {
    const base = btnId.replace("-btn", "");
    const screenId = `${base}-screen`;

    hideAllScreens();

    const screen = document.getElementById(screenId);
    if (screen) {
      screen.style.display = "block";
    } else {
      console.warn("Tela não encontrada:", screenId);
    }
  }

  // Tela inicial: Dashboard
  hideAllScreens();
  if (document.getElementById("dashboard-screen")) {
    document.getElementById("dashboard-screen").style.display = "block";
  }


  const observer = new MutationObserver(() => {
    const navLinks = document.querySelectorAll(
      "#header-dash-intcolab .navitem, #header-dash-intcolab .active"
    );

    if (!navLinks.length) return;

    const dashboardBtns = document.querySelectorAll('button[id$="-btn"]');

    // trocar active
    function setActive(id) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (!link.classList.contains("navitem")) link.classList.add("navitem");
      });

      const selected = document.getElementById(id);
      if (selected) {
        selected.classList.add("active");
        selected.classList.remove("navitem");
      }
    }

    // trocar tela
    function openScreen(id) {
      if (id === "dashboard-btn") {
        hideAllScreens();
        document.getElementById("dashboard-screen").style.display = "block";
        return;
      }
      showScreenByButtonId(id);
    }

    // clique navbar
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const id = link.id;
        if (!id) return;
        setActive(id);
        openScreen(id);
      });
    });

    // clique nos cards da dashboard (Isso fará o candidaturas-btn funcionar)
    dashboardBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.id;
        setActive(id);
        openScreen(id);
      });
    });

    observer.disconnect();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------------------------
       SISTEMA DE TELAS (NAVEGAÇÃO)
    -------------------------------------------------------------------------- */
  const dashboardScreen = document.getElementById("dashboard-screen");
  const treinamentosScreen = document.getElementById("treinamentos-screen");
  const candidaturasScreen = document.getElementById("candidaturas-screen");
  const visualizarCandidaturaScreen = document.getElementById(
    "visualizar-candidatura-screen"
  ); // Nova tela

  function hideAllScreens() {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.style.display = "none";
    });
  }

  function showScreen(screen) {
    hideAllScreens();
    if (screen) screen.style.display = "block";
  }

  /* --------------------------------------------------------------------------
       EVENTS: DASHBOARD & NAVBAR
    -------------------------------------------------------------------------- */
  // Botões do Dashboard principal
  const btnCandidaturas = document.getElementById("candidaturas-btn");
  if (btnCandidaturas) {
    btnCandidaturas.addEventListener("click", () => {
      showScreen(candidaturasScreen);
      initCandidaturasTable();
    });
  }

  const btnTreinamentos = document.getElementById("treinamentos-btn");
  if (btnTreinamentos) {
    btnTreinamentos.addEventListener("click", () => {
      showScreen(treinamentosScreen);
    });
  }

  // Botão Voltar da tela de Detalhes para a Lista
  const btnVoltarLista = document.getElementById("voltar-para-lista");
  if (btnVoltarLista) {
    btnVoltarLista.addEventListener("click", () => {
      showScreen(candidaturasScreen);
    });
  }

  // Botões "Voltar" genéricos
  document.querySelectorAll(".voltar-dash, .btn-voltar-dash").forEach((btn) => {
    btn.addEventListener("click", () => {
      showScreen(dashboardScreen);
    });
  });

  // Botão Voltar da lista de candidaturas para dashboard
  const btnVoltarCand = document.getElementById("voltar-de-cand");
  if (btnVoltarCand) {
    btnVoltarCand.addEventListener("click", () => {
      showScreen(dashboardScreen);
    });
  }

  /* --------------------------------------------------------------------------
       DADOS MOCKADOS
    -------------------------------------------------------------------------- */

  // Lista de Candidatos (Resumo)
  const listaCandidatos = [
    {
      id: 1,
      nome: "Raquel Araújo da Silva",
      cpf: "456.787.154-13",
      codigo: "310-98474",
    },
    {
      id: 2,
      nome: "Marcos Artur Cordeiro",
      cpf: "731.295.864-01",
      codigo: "382-20862",
    },
    {
      id: 3,
      nome: "Lucas Almeida",
      cpf: "482.913.257-60",
      codigo: "123-45678",
    },
    {
      id: 4,
      nome: "Paulo Cesar Araujo",
      cpf: "111.222.333-44",
      codigo: "999-00001",
    }, // Exemplo da imagem
  ];

  // Detalhes das Vagas (Simulando banco de dados relacional)
  // As chaves são os IDs dos candidatos ou nomes, farei por ID para ser robusto, mas mapping por nome para simplificar a demo.
  const detalhesVagas = {
    "Paulo Cesar Araujo": [
      {
        cod: "13810006",
        vaga: "Engenheiro de Dados",
        data: "02/08/2024 - 20:30",
        status: "reprovado",
      },
      {
        cod: "18610006",
        vaga: "Analista de Suporte Técnico",
        data: "07/01/2025 - 07:42",
        status: "aprovado",
      },
      {
        cod: "14510006",
        vaga: "Analista de Suporte Técnico",
        data: "07/01/2025 - 07:42",
        status: "pendente",
      },
      {
        cod: "18610006",
        vaga: "Analista de Suporte Técnico",
        data: "07/01/2025 - 07:42",
        status: "pendente",
      },
      {
        cod: "14510006",
        vaga: "Analista de Suporte Técnico",
        data: "07/01/2025 - 07:42",
        status: "pendente",
      },
    ],
    "Raquel Araújo da Silva": [
      {
        cod: "33310006",
        vaga: "Desenvolvedor Front-end",
        data: "10/09/2025 - 10:00",
        status: "pendente",
      },
      {
        cod: "44410006",
        vaga: "UX Designer",
        data: "11/09/2025 - 14:30",
        status: "aprovado",
      },
    ],
    // Se o candidato não tiver lista aqui, mostrarei vazio
  };

  /* --------------------------------------------------------------------------
       LÓGICA: LISTA DE CANDIDATURAS
    -------------------------------------------------------------------------- */
  function initCandidaturasTable() {
    const tbody = document.getElementById("tableBodyCandidaturas");
    const dotsContainer = document.getElementById("candDots");

    if (!tbody) return;
    tbody.innerHTML = "";

    // Se AuthLocal disponível, buscar candidatos reais do localStorage
    const candidatos = window.AuthLocal ? AuthLocal.getPendingCandidates() : listaCandidatos;

    if (!candidatos || candidatos.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4' style='text-align:center;padding:20px;color:#666;'>Nenhuma candidatura/pendente encontrada.</td></tr>";
      return;
    }

    candidatos.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${c.nome}</td>
                <td>${(c.cpf||'')}</td>
                <td>${c.id || ''}</td>
                <td>
                    <div class="cand-actions">
                        <button class="c-btn btn-yellow btn-ver-detalhe" data-nome="${c.nome}">
                            <i class="fa fa-eye"></i> Ver
                        </button>
                        <button class="c-btn btn-green btn-approve" data-cpf="${c.cpf}"><i class="fa fa-check"></i> Aprovar</button>
                        <button class="c-btn btn-red btn-reject" data-cpf="${c.cpf}"><i class="fa fa-times"></i> Rejeitar</button>
                    </div>
                </td>
            `;
      tbody.appendChild(tr);
    });

    // Eventos
    document.querySelectorAll(".btn-ver-detalhe").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const nomeCandidato = btn.getAttribute("data-nome");
        abrirDetalhesCandidato(nomeCandidato);
      });
    });

    document.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cpf = btn.getAttribute('data-cpf');
        if (confirm('Aprovar candidato e torná-lo colaborador?')) {
          if (window.AuthLocal) {
            AuthLocal.approveCandidate(cpf);
            initCandidaturasTable();
            alert('Candidato aprovado e convertido em colaborador.');
          }
        }
      });
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cpf = btn.getAttribute('data-cpf');
        if (confirm('Remover candidato?')) {
          if (window.AuthLocal) {
            // simples remoção
            const users = AuthLocal.getUsers().filter(u => (u.cpf||'').replace(/\D/g,'') !== (cpf||'').replace(/\D/g,''));
            AuthLocal.saveUsers(users);
            initCandidaturasTable();
            alert('Candidato removido.');
          }
        }
      });
    });

    // Decoração
    if (dotsContainer && dotsContainer.children.length === 0) {
      for (let i = 0; i < 60; i++) {
        let dot = document.createElement("div");
        dot.className = "c-dot";
        dotsContainer.appendChild(dot);
      }
    }
  }

  /* --------------------------------------------------------------------------
       LÓGICA: VISUALIZAR DETALHES (NOVA)
    -------------------------------------------------------------------------- */
  function abrirDetalhesCandidato(nome) {
    // 1. Troca de tela
    showScreen(visualizarCandidaturaScreen);

    // 2. Preenche Título
    document.getElementById("nomeCandidatoTitulo").textContent = nome;

    // 3. Preenche Tabela
    const tbody = document.getElementById("tableBodyDetalhes");
    tbody.innerHTML = "";

    // Pega as vagas desse candidato (ou array vazio se não existir mock)
    const vagas = detalhesVagas[nome] || [];

    if (vagas.length === 0) {
      tbody.innerHTML =
        "<tr><td colspan='5' style='text-align:center; padding: 20px;'>Nenhuma candidatura encontrada para este perfil.</td></tr>";
      return;
    }

    vagas.forEach((vaga, index) => {
      const tr = document.createElement("tr");

      // Define o HTML do Status (Badge)
      let badgeClass = "";
      let label = vaga.status;

      if (vaga.status === "aprovado") badgeClass = "badge-aprovado";
      else if (vaga.status === "reprovado") badgeClass = "badge-reprovado";
      else badgeClass = "badge-pendente";

      const statusHtml = `<span class="badge ${badgeClass}">${label}</span>`;

      // Define o HTML das Ações (Só mostra botões se for pendente)
      let acoesHtml = "";
      if (vaga.status === "pendente") {
        acoesHtml = `
                    <div class="action-btn-group">
                        <button class="btn-small btn-approve" onclick="alterarStatus('${nome}', ${index}, 'aprovado')">Aprovar</button>
                        <button class="btn-small btn-reject" onclick="alterarStatus('${nome}', ${index}, 'reprovado')">Reprovar</button>
                    </div>
                `;
      }

      tr.innerHTML = `
                <td>${vaga.cod}</td>
                <td>${vaga.vaga}</td>
                <td>${vaga.data}</td>
                <td>${statusHtml}</td>
                <td>${acoesHtml}</td>
            `;
      tbody.appendChild(tr);
    });

    // Decoração da tela de detalhes
    const visDots = document.getElementById("visDots");
    if (visDots && visDots.children.length === 0) {
      for (let i = 0; i < 60; i++) {
        let dot = document.createElement("div");
        dot.className = "c-dot";
        visDots.appendChild(dot);
      }
    }
  }

  // Função global para ser acessada pelo onclick do HTML gerado dinamicamente
  window.alterarStatus = function (nomeCandidato, indexVaga, novoStatus) {
    // Atualiza o dado no objeto mockado
    if (
      detalhesVagas[nomeCandidato] &&
      detalhesVagas[nomeCandidato][indexVaga]
    ) {
      detalhesVagas[nomeCandidato][indexVaga].status = novoStatus;
      // Re-renderiza a tabela para mostrar o novo status
      abrirDetalhesCandidato(nomeCandidato);
    }
  };
});
