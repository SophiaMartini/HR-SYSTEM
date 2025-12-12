// candidaturas-candidato.js

let candidaturas = [];
let filteredCandidaturas = [];

// Função principal para carregar candidaturas
async function loadCandidaturas() {
    try {
        const userId = getUserId();
        
        // Simulação de API - substitua pelo seu endpoint real
        const response = await fetch(`/api/candidaturas?candidato_id=${userId}`);
        if (!response.ok) throw new Error('Erro ao carregar candidaturas');
        
        candidaturas = await response.json();
        filteredCandidaturas = [...candidaturas];
        
        renderCandidaturas();
        setupFilters();
        
        // Mostra/oculta estado vazio
        toggleEmptyState();
        
    } catch (error) {
        console.error('Erro:', error);
        showCandidaturasError('Erro ao carregar candidaturas');
    }
}

// Renderiza as candidaturas
function renderCandidaturas() {
    const container = document.getElementById("candidaturas-list");
    
    if (!container) return;
    
    if (filteredCandidaturas.length === 0) {
        toggleEmptyState(true);
        return;
    }
    
    // Remove o estado vazio se existir
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    container.innerHTML = filteredCandidaturas.map(candidatura => `
        <div class="candidatura-card">
            <div class="candidatura-header">
                <h3>${candidatura.titulo_vaga}</h3>
                <span class="candidatura-status status ${candidatura.status.toLowerCase()}">
                    ${candidatura.status}
                </span>
            </div>
            
            <div class="candidatura-info">
                <p><strong>Departamento:</strong> ${candidatura.departamento_nome}</p>
                <p><strong>Data da Candidatura:</strong> ${formatDate(candidatura.data_candidatura)}</p>
                <p><strong>Tipo de Contratação:</strong> ${candidatura.tipo_contratacao}</p>
                <p><strong>Localização:</strong> ${candidatura.localizacao}</p>
            </div>
            
            ${candidatura.feedback ? `
            <div class="candidatura-feedback">
                <strong>Feedback:</strong> ${candidatura.feedback}
            </div>
            ` : ''}
            
            <div class="candidatura-actions">
                <button class="detalhes-btn" onclick="verDetalhesVaga(${candidatura.id_vaga})">
                    <i class="fas fa-eye"></i> Ver Detalhes da Vaga
                </button>
                
                ${candidatura.status === 'Recebido' || candidatura.status === 'Triagem' ? `
                <button class="cancelar-btn" onclick="cancelarCandidatura(${candidatura.id_candidatura}, '${candidatura.titulo_vaga.replace(/'/g, "\\'")}')">
                    <i class="fas fa-times"></i> Cancelar Candidatura
                </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Configura os filtros
function setupFilters() {
    const filterStatus = document.getElementById("filter-status");
    const filterDate = document.getElementById("filter-date");
    
    if (filterStatus) {
        filterStatus.addEventListener("change", applyFilters);
    }
    
    if (filterDate) {
        filterDate.addEventListener("change", applyFilters);
    }
}

// Aplica os filtros
function applyFilters() {
    const filterStatus = document.getElementById("filter-status")?.value;
    const filterDate = document.getElementById("filter-date")?.value;
    
    filteredCandidaturas = candidaturas.filter(candidatura => {
        // Filtro por status
        if (filterStatus && candidatura.status !== filterStatus) {
            return false;
        }
        
        // Filtro por data
        if (filterDate) {
            const candidaturaDate = new Date(candidatura.data_candidatura).toISOString().split('T')[0];
            if (candidaturaDate !== filterDate) {
                return false;
            }
        }
        
        return true;
    });
    
    renderCandidaturas();
    toggleEmptyState();
}

// Mostra/oculta estado vazio
function toggleEmptyState(forceShow = false) {
    const container = document.getElementById("candidaturas-list");
    
    if (!container) return;
    
    if (forceShow || filteredCandidaturas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>Você ainda não possui candidaturas</p>
                <button id="explorar-vagas-from-empty">Explorar Vagas</button>
            </div>
        `;
        
        // Adiciona evento ao botão
        document.getElementById("explorar-vagas-from-empty")?.addEventListener("click", () => {
            window.showScreen("vagas");
        });
    }
}

// Função para ver detalhes da vaga
async function verDetalhesVaga(vagaId) {
    try {
        // Simulação de API - substitua pelo seu endpoint real
        const response = await fetch(`/api/vagas/${vagaId}`);
        if (!response.ok) throw new Error('Erro ao carregar detalhes');
        
        const vaga = await response.json();
        
        // Mostra modal com detalhes (implementação básica)
        const detalhes = `
            <h3>${vaga.titulo}</h3>
            <p><strong>Salário:</strong> R$ ${parseFloat(vaga.salario).toFixed(2)}</p>
            <p><strong>Descrição:</strong> ${vaga.descricao}</p>
            <p><strong>Requisitos:</strong></p>
            <p>${vaga.requisitos || 'Não especificado'}</p>
            <p><strong>Tipo de Contratação:</strong> ${vaga.tipo_contratacao}</p>
            <p><strong>Localização:</strong> ${vaga.localizacao}</p>
        `;
        
        alert(detalhes); // Substitua por um modal bonito
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar detalhes da vaga');
    }
}

// Função para cancelar candidatura
async function cancelarCandidatura(candidaturaId, vagaTitulo) {
    if (!confirm(`Tem certeza que deseja cancelar sua candidatura para "${vagaTitulo}"?`)) {
        return;
    }
    
    try {
        // Simulação de API - substitua pelo seu endpoint real
        const response = await fetch(`/api/candidaturas/${candidaturaId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erro ao cancelar candidatura');
        
        alert('Candidatura cancelada com sucesso!');
        
        // Recarrega as candidaturas
        loadCandidaturas();
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cancelar candidatura. Tente novamente.');
    }
}

// Formata data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Função para obter ID do usuário
function getUserId() {
    return localStorage.getItem('user_id') || 1;
}

// Função para mostrar erro
function showCandidaturasError(message) {
    const container = document.getElementById("candidaturas-list");
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="loadCandidaturas()">Tentar Novamente</button>
            </div>
        `;
    }
}

// Carrega candidaturas quando a tela é aberta
window.addEventListener('screenChanged', (event) => {
    if (event.detail.screen === 'candidaturas') {
        loadCandidaturas();
    }
});

// Exporta funções para uso global
window.loadCandidaturas = loadCandidaturas;
window.cancelarCandidatura = cancelarCandidatura;
window.verDetalhesVaga = verDetalhesVaga;

console.log("Candidaturas Candidato carregado!");