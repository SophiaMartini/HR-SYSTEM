document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------------------------
       SISTEMA DE TELAS (FUNÇÕES ESSENCIAIS)
    -------------------------------------------------------------------------- */

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

  /* --------------------------------------------------------------------------
       ELEMENTOS PRINCIPAIS (TREINAMENTOS)
    -------------------------------------------------------------------------- */

  const novoTreinamentoBtn = document.getElementById("novoTreinamentoBtn");
  const formWrapper = document.getElementById("formTreinamento");
  const cadastroForm = document.getElementById("cadastroTreinamento");
  const cancelarBtn = document.getElementById("canvelarFormBtn0");
  const addAulaBtn = document.getElementById("addAulaBtn");
  const listaAulas = document.getElementById("listaAulas");
  const treinamentosGrid = document.getElementById("treinamentos_grid");

  const instrutorSelect = document.getElementById("instrutorCurso");
  const imagemInput = document.getElementById("imagemCurso");

  /* --------------------------------------------------------------------------
       INSTRUTORES (FALLBACK)
    -------------------------------------------------------------------------- */

  const colaboradoresFallback = [
    { id: 1, nome: "Marina Souza" },
    { id: 2, nome: "João Pereira" },
    { id: 3, nome: "Beatriz Lima" },
    { id: 4, nome: "Carlos Nogueira" },
  ];

  function preencherInstrutores() {
    if (!instrutorSelect) return;
    instrutorSelect.innerHTML = '<option value="">Selecione</option>';
    colaboradoresFallback.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nome;
      instrutorSelect.appendChild(opt);
    });
  }

  preencherInstrutores();

  /* --------------------------------------------------------------------------
       LOCAL STORAGE (CRUD TREINAMENTOS)
    -------------------------------------------------------------------------- */

  const LS_KEY = "rh_treinamentos";

  function carregarTreinamentos() {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  }

  function salvarTreinamentos(arr) {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  }

  function gerarId() {
    return "T" + Date.now();
  }

  /* --------------------------------------------------------------------------
       AULAS DINÂMICAS
    -------------------------------------------------------------------------- */

  function criarAulaDOM(aula = {}) {
    if (!listaAulas) return;

    const div = document.createElement("div");
    div.className = "aula";

    div.innerHTML = `
        <input type="text" class="tituloAula" placeholder="Título" value="${
          aula.titulo || ""
        }">
        <textarea class="descAula" placeholder="Descrição">${
          aula.descricao || ""
        }</textarea>
        <input type="url" class="linkAula" placeholder="Link (vídeo/PDF)" value="${
          aula.link || ""
        }">
        <button type="button" class="removerAulaBtn">Remover aula</button>
      `;

    div
      .querySelector(".removerAulaBtn")
      .addEventListener("click", () => div.remove());

    listaAulas.appendChild(div);
  }

  if (addAulaBtn) {
    addAulaBtn.addEventListener("click", () => criarAulaDOM());
  }

  /* --------------------------------------------------------------------------
       GRID DE TREINAMENTOS
    -------------------------------------------------------------------------- */

  function renderizarGrid() {
    if (!treinamentosGrid) return;

    const lista = carregarTreinamentos();
    treinamentosGrid.innerHTML = "";

    if (!lista.length) {
      treinamentosGrid.innerHTML = "<p>Nenhum treinamento cadastrado.</p>";
      return;
    }

    lista.forEach((t) => {
      const card = document.createElement("div");
      card.classList.add("card_treinamento");

      card.innerHTML = `
          <div class="capa_treinamento">
            ${
              t.capa
                ? `<img src="${t.capa}">`
                : `<i class="fa-solid fa-graduation-cap"></i>`
            }
          </div>
  
          <h3>${t.titulo}</h3>
          <p>${t.descricao}</p>
          <small>Instrutor: ${t.instrutorNome}</small>
  
          <div class="acoes_treinamento">
            <button class="editarBtn" data-id="${t.id}">Editar</button>
            <button class="excluirBtn" data-id="${t.id}">Excluir</button>
          </div>
        `;

      treinamentosGrid.appendChild(card);

      card.querySelector(".excluirBtn").addEventListener("click", () => {
        const arr = carregarTreinamentos().filter((x) => x.id !== t.id);
        salvarTreinamentos(arr);
        renderizarGrid();
      });

      card
        .querySelector(".editarBtn")
        .addEventListener("click", () => abrirEdicao(t.id));
    });
  }

  /* --------------------------------------------------------------------------
       NOVO TREINAMENTO
    -------------------------------------------------------------------------- */

  if (novoTreinamentoBtn) {
    novoTreinamentoBtn.addEventListener("click", () => {
      cadastroForm.reset();
      listaAulas.innerHTML = "";
      cadastroForm.dataset.editId = "";
      formWrapper.style.display = "block";
    });
  }

  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      formWrapper.style.display = "none";
    });
  }

  /* --------------------------------------------------------------------------
       EDITAR TREINAMENTO
    -------------------------------------------------------------------------- */

  function abrirEdicao(id) {
    const todos = carregarTreinamentos();
    const t = todos.find((x) => x.id === id);

    cadastroForm.dataset.editId = id;

    document.getElementById("tituloCurso").value = t.titulo;
    document.getElementById("descricaoCurso").value = t.descricao;
    instrutorSelect.value = t.instrutorId;

    listaAulas.innerHTML = "";
    t.aulas.forEach((a) => criarAulaDOM(a));

    formWrapper.style.display = "block";
  }

  /* --------------------------------------------------------------------------
       SALVAR FORMULÁRIO (CRIAR / EDITAR)
    -------------------------------------------------------------------------- */

  if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const titulo = document.getElementById("tituloCurso").value;
      const descricao = document.getElementById("descricaoCurso").value;
      const instrutorId = instrutorSelect.value;
      const instrutorNome =
        instrutorSelect.options[instrutorSelect.selectedIndex].text;

      let capaBase64 = null;

      if (imagemInput.files[0]) {
        capaBase64 = await new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.readAsDataURL(imagemInput.files[0]);
        });
      }

      const aulas = [...document.querySelectorAll(".aula")].map((a) => ({
        titulo: a.querySelector(".tituloAula").value,
        descricao: a.querySelector(".descAula").value,
        link: a.querySelector(".linkAula").value,
      }));

      let lista = carregarTreinamentos();
      const editId = cadastroForm.dataset.editId;

      if (editId) {
        const idx = lista.findIndex((x) => x.id === editId);
        lista[idx] = {
          ...lista[idx],
          titulo,
          descricao,
          instrutorId,
          instrutorNome,
          capa: capaBase64 || lista[idx].capa,
          aulas,
        };
      } else {
        lista.push({
          id: gerarId(),
          titulo,
          descricao,
          instrutorId,
          instrutorNome,
          capa: capaBase64,
          aulas,
        });
      }

      salvarTreinamentos(lista);
      renderizarGrid();

      cadastroForm.reset();
      listaAulas.innerHTML = "";
      formWrapper.style.display = "none";
    });
  }

  renderizarGrid();

  /* ==========================================================================
       NOVO BLOCO: LÓGICA DE CANDIDATURAS (ADICIONADO)
       ========================================================================== */

  // Dados Mockados para demonstração
  const listaCandidatos = [
    {
      nome: "Raquel Araújo da Silva",
      cpf: "456.787.154-13",
      codigo: "310-98474",
    },
    {
      nome: "Marcos Artur Cordeiro",
      cpf: "731.295.864-01",
      codigo: "382-20862",
    },
    { nome: "Lucas Almeida", cpf: "482.913.257-60", codigo: "123-45678" },
    { nome: "Mariana Costa", cpf: "604.389.215-77", codigo: "382-20862" },
    {
      nome: "Pedro Henrique Silva",
      cpf: "823.145.679-02",
      codigo: "310-98474",
    },
    { nome: "Camila Rocha", cpf: "259.804.671-39", codigo: "382-20862" },
    { nome: "Rafael Monteiro", cpf: "915.472.306-28", codigo: "258-96347" },
    {
      nome: "Ana Beatriz Carvalho",
      cpf: "456.787.154-13",
      codigo: "382-20862",
    },
  ];

  function initCandidaturas() {
    const tbody = document.getElementById("tableBodyCandidaturas");
    const dotsContainer = document.getElementById("candDots");
    const btnVoltarCand = document.getElementById("voltar-de-cand");

    // Configura o botão de voltar específico da tela de candidaturas
    if (btnVoltarCand) {
      btnVoltarCand.addEventListener("click", () => {
        hideAllScreens();
        const dash = document.getElementById("dashboard-screen");
        if (dash) dash.style.display = "block";
      });
    }

    // Renderiza a Tabela
    if (tbody) {
      tbody.innerHTML = "";
      listaCandidatos.forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${c.nome}</td>
                    <td>${c.cpf}</td>
                    <td>${c.codigo}</td>
                    <td>
                        <div class="cand-actions">
                            <button class="c-btn btn-yellow" title="Ver"><i class="fa fa-eye"></i> Ver</button>
                            <button class="c-btn btn-blue" title="Baixar"><i class="fa fa-download"></i> Baixar</button>
                            <button class="c-btn btn-red" title="Excluir"><i class="fa fa-times"></i></button>
                        </div>
                    </td>
                `;
        tbody.appendChild(tr);
      });
    }

    // Renderiza os Pontinhos Decorativos
    if (dotsContainer && dotsContainer.children.length === 0) {
      for (let i = 0; i < 60; i++) {
        let dot = document.createElement("div");
        dot.className = "c-dot";
        dotsContainer.appendChild(dot);
      }
    }
  }

  // Inicializa a tabela de candidaturas assim que o JS carrega
  initCandidaturas();

  // Botões de voltar genéricos (que podem existir em outras telas)
  document.querySelectorAll(".voltar-dash").forEach((btn) => {
    btn.addEventListener("click", () => {
      hideAllScreens();
      const dash = document.getElementById("dashboard-screen");
      if (dash) dash.style.display = "block";
    });
  });

  /* --------------------------------------------------------------------------
       NAVBAR — ACTIVE + TROCA DE TELA (OBSERVER)
    -------------------------------------------------------------------------- */

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

    listaCandidatos.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${c.nome}</td>
                <td>${c.cpf}</td>
                <td>${c.codigo}</td>
                <td>
                    <div class="cand-actions">
                        <button class="c-btn btn-yellow btn-ver-detalhe" data-nome="${c.nome}">
                            <i class="fa fa-eye"></i> Ver
                        </button>
                        <button class="c-btn btn-blue"><i class="fa fa-download"></i> Baixar</button>
                        <button class="c-btn btn-red"><i class="fa fa-times"></i></button>
                    </div>
                </td>
            `;
      tbody.appendChild(tr);
    });

    // Adiciona evento aos botões "Ver" recém criados
    document.querySelectorAll(".btn-ver-detalhe").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const nomeCandidato = btn.getAttribute("data-nome");
        abrirDetalhesCandidato(nomeCandidato);
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
