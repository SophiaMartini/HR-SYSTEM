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
