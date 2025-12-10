// --- DADOS MOCKADOS (Simulando o Banco de Dados) ---
let listaDepartamentos = [
  {
    id: 1,
    nome: "Tecnologia",
    sigla: "TI",
    telefone: "(61) 3333-1001",
    localizacao: "Bloco C",
    descricao: "Suporte e desenvolvimento de sistemas internos.",
  },
  {
    id: 2,
    nome: "Recursos Humanos",
    sigla: "RH",
    telefone: "(61) 3333-1002",
    localizacao: "Bloco A",
    descricao: "Gestão de pessoas, contratações e treinamentos.",
  },
  {
    id: 3,
    nome: "Financeiro",
    sigla: "FIN",
    telefone: "(61) 3333-1003",
    localizacao: "Bloco B",
    descricao: "Contabilidade, fiscal e pagamentos.",
  },
];

// --- ELEMENTOS DOM (Com nomes únicos para evitar conflito com outros scripts) ---
const dtContainer = document.getElementById("cardsContainer");
const dtModal = document.getElementById("departmentModal");
const dtForm = document.getElementById("deptForm");
const dtModalTitle = document.getElementById("modalTitle");
const dtIdInput = document.getElementById("deptId");
const dtSearchInput = document.getElementById("searchInput");

// --- FUNÇÃO DE RENDERIZAÇÃO ---
function renderDepartments(data = listaDepartamentos) {
  // Verificação de segurança: se o container não existir, para o script
  if (!dtContainer) return;

  dtContainer.innerHTML = "";

  if (data.length === 0) {
    dtContainer.innerHTML =
      '<p style="color:#666; grid-column: 1/-1; text-align:center; padding: 20px;">Nenhum departamento encontrado.</p>';
    return;
  }

  data.forEach((dept) => {
    const card = document.createElement("div");
    // Usando a classe nova do CSS
    card.className = "dt-unity-card";

    card.innerHTML = `
            <div class="dt-info-block">
                <h3>${dept.nome} <small style="font-size:0.8em; color:#888;">(${dept.sigla})</small></h3>
                <p><strong>Tel:</strong> ${dept.telefone}</p>
                <p><strong>Local:</strong> ${dept.localizacao}</p>
                <p style="margin-top:8px; font-size:0.9em; color:#555;">${dept.descricao}</p>
            </div>
            <div class="dt-tools-block">
                <button class="dt-action-btn" onclick="editDept(${dept.id})" title="Editar">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="dt-action-btn" onclick="deleteDept(${dept.id})" title="Excluir">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
    dtContainer.appendChild(card);
  });
}

// --- FUNÇÕES DO MODAL ---

// Abre o modal (chamado pelo botão HTML)
function openModal(isEdit = false) {
  if (dtModal) {
    dtModalTitle.innerText = isEdit
      ? "Editar Departamento"
      : "Novo Departamento";
    dtModal.style.display = "flex";
  }
}

// Fecha o modal
function closeModal() {
  if (dtModal) {
    dtModal.style.display = "none";
    dtForm.reset();
    dtIdInput.value = "";
  }
}

// Fecha ao clicar fora do modal
window.onclick = function (event) {
  if (event.target == dtModal) {
    closeModal();
  }
};

// --- CRUD (Create, Read, Update, Delete) ---

// Salvar (Adicionar ou Editar)
function saveDepartment(e) {
  e.preventDefault();

  const id = dtIdInput.value;

  // Pegando valores do formulário
  const novoDept = {
    id: id ? parseInt(id) : Date.now(), // Gera ID único se for novo
    nome: document.getElementById("nome").value,
    sigla: document.getElementById("sigla").value,
    telefone: document.getElementById("telefone").value,
    localizacao: document.getElementById("localizacao").value,
    descricao: document.getElementById("descricao").value,
  };

  if (id) {
    // MODO EDIÇÃO
    const index = listaDepartamentos.findIndex((d) => d.id == id);
    if (index > -1) {
      listaDepartamentos[index] = novoDept;
    }
  } else {
    // MODO CRIAÇÃO
    listaDepartamentos.push(novoDept);
  }

  renderDepartments();
  closeModal();
}

// Preparar Edição
function editDept(id) {
  const dept = listaDepartamentos.find((d) => d.id === id);
  if (dept) {
    dtIdInput.value = dept.id;
    document.getElementById("nome").value = dept.nome;
    document.getElementById("sigla").value = dept.sigla;
    document.getElementById("telefone").value = dept.telefone;
    document.getElementById("localizacao").value = dept.localizacao;
    document.getElementById("descricao").value = dept.descricao;

    openModal(true); // Abre modal em modo edição
  }
}

// Excluir
function deleteDept(id) {
  if (confirm("Tem certeza que deseja excluir este departamento?")) {
    listaDepartamentos = listaDepartamentos.filter((d) => d.id !== id);
    renderDepartments();
  }
}

// --- FILTRO DE BUSCA ---
function filterDepartments() {
  if (!dtSearchInput) return;

  const term = dtSearchInput.value.toLowerCase();
  const filtered = listaDepartamentos.filter(
    (d) =>
      d.nome.toLowerCase().includes(term) ||
      d.sigla.toLowerCase().includes(term)
  );
  renderDepartments(filtered);
}

// --- INICIALIZAÇÃO ---
// Garante que o script rode apenas quando o HTML estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  renderDepartments();
});
