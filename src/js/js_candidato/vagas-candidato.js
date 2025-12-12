// vagas-candidato.js

let departamentos = [];
let filteredDepartamentos = [];

// Função principal para carregar departamentos
async function loadDepartamentos() {
    try {
        // Simulação de API - substitua pelo seu endpoint real
        const response = await fetch('/api/departamentos');
        if (!response.ok) throw new Error('Erro ao carregar departamentos');
        
        departamentos = await response.json();
        filteredDepartamentos = [...departamentos];
        
        renderDepartamentos();
        setupSearch();
        
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao carregar departamentos');
    }
}

// Renderiza os departamentos na grid
function renderDepartamentos() {
    const grid = document.getElementById("departamentos-grid");
    
    if (!grid) return;
    
    if (filteredDepartamentos.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nenhum departamento encontrado</h3>
                <p>Tente buscar por outro termo</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredDepartamentos.map(depto => `
        <div class="departamento-card" onclick="window.goToDepartamento(${depto.id_departamento}, '${depto.nome.replace(/'/g, "\\'")}', '${depto.descricao.replace(/'/g, "\\'")}')">
            <h3>${depto.nome}</h3>
            <p>${depto.descricao}</p>
            <div class="departamento-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${depto.localizacao || 'Não informado'}</span>
                <span><i class="fas fa-phone"></i> ${depto.telefone || 'Não informado'}</span>
            </div>
            <button class="ver-vagas-btn" onclick="event.stopPropagation(); window.goToDepartamento(${depto.id_departamento}, '${depto.nome.replace(/'/g, "\\'")}', '${depto.descricao.replace(/'/g, "\\'")}')">
                Ver Vagas <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `).join('');
}

// Configura a busca de departamentos
function setupSearch() {
    const searchInput = document.getElementById("busca-departamentos");
    
    if (!searchInput) return;
    
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredDepartamentos = [...departamentos];
        } else {
            filteredDepartamentos = departamentos.filter(depto => 
                depto.nome.toLowerCase().includes(searchTerm) ||
                depto.descricao.toLowerCase().includes(searchTerm) ||
                (depto.sigla && depto.sigla.toLowerCase().includes(searchTerm))
            );
        }
        
        renderDepartamentos();
    });
}

// Função para mostrar erro
function showError(message) {
    const grid = document.getElementById("departamentos-grid");
    if (grid) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro ao carregar</h3>
                <p>${message}</p>
                <button onclick="loadDepartamentos()" class="ver-vagas-btn">
                    Tentar Novamente
                </button>
            </div>
        `;
    }
}

// Carrega departamentos quando a tela de vagas é aberta
window.addEventListener('screenChanged', (event) => {
    if (event.detail.screen === 'vagas') {
        loadDepartamentos();
    }
});

// Exporta funções para uso global
window.loadDepartamentos = loadDepartamentos;
window.renderDepartamentos = renderDepartamentos;

console.log("Vagas Candidato carregado!");