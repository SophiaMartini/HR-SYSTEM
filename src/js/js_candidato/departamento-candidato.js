// departamento-candidato.js

let vagas = [];
let filteredVagas = [];
let currentDepartamentoId = null;

// Função para carregar vagas de um departamento
async function loadVagasDepartamento(departamentoId) {
    try {
        currentDepartamentoId = departamentoId;
        
        // Usar API fake
        vagas = await window.API.getVagasByDepartamento(departamentoId);
        filteredVagas = [...vagas];
        
        renderVagas();
        setupVagasSearch();
        
    } catch (error) {
        console.error('Erro:', error);
        showVagasError('Erro ao carregar vagas');
    }
}

// Renderiza as vagas na grid
function renderVagas() {
    const grid = document.getElementById("vagas-grid");
    
    if (!grid) return;
    
    if (filteredVagas.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-briefcase"></i>
                <h3>Nenhuma vaga encontrada</h3>
                <p>Não há vagas abertas neste departamento no momento</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredVagas.map(vaga => `
        <div class="vaga-card">
            <h3>${vaga.titulo}</h3>
            <div class="salario">R$ ${parseFloat(vaga.salario_inicial || vaga.salario).toFixed(2)}</div>
            <p>${vaga.descricao.substring(0, 150)}${vaga.descricao.length > 150 ? '...' : ''}</p>
            
            ${vaga.requisitos ? `
            <div class="vaga-detalhes">
                <h4>Requisitos:</h4>
                <ul>
                    ${vaga.requisitos.split('\n').map(req => `<li>${req.trim()}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            <div class="vaga-meta">
                <span><i class="fas fa-file-contract"></i> ${vaga.tipo_contratacao}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${vaga.localizacao}</span>
            </div>
            
            <button class="candidatar-btn" onclick="candidatarVaga(${vaga.id_vaga}, '${vaga.titulo.replace(/'/g, "\\'")}')">
                Candidatar-se <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `).join('');
}

// Configura a busca de vagas
function setupVagasSearch() {
    const searchInput = document.getElementById("busca-vagas");
    
    if (!searchInput) return;
    
    searchInput.value = ''; // Limpa o campo de busca
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredVagas = [...vagas];
        } else {
            filteredVagas = vagas.filter(vaga => 
                vaga.titulo.toLowerCase().includes(searchTerm) ||
                vaga.descricao.toLowerCase().includes(searchTerm) ||
                vaga.requisitos?.toLowerCase().includes(searchTerm)
            );
        }
        
        renderVagas();
    });
}

// Função para candidatar-se a uma vaga
async function candidatarVaga(vagaId, vagaTitulo) {
    try {
        // Verifica se já está candidatado
        const jaCandidatado = await verificarCandidatura(vagaId);
        
        if (jaCandidatado) {
            if (confirm('Você já se candidatou a esta vaga. Deseja ver suas candidaturas?')) {
                window.showScreen('candidaturas');
            }
            return;
        }
        
        // Confirmação do usuário
        if (!confirm(`Deseja se candidatar à vaga "${vagaTitulo}"?`)) {
            return;
        }
        
        // Simulação de API - substitua pelo seu endpoint real
        await window.API.createCandidatura({ id_vaga: vagaId, id_candidato: getUserId() });
        alert('Candidatura enviada com sucesso!');
        
        // Atualiza o botão
        const btn = document.querySelector(`.candidatar-btn[onclick*="${vagaId}"]`);
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Candidatura Enviada';
            btn.classList.add('disabled');
            btn.onclick = null;
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar candidatura. Tente novamente.');
    }
}

// Verifica se já existe candidatura para a vaga
async function verificarCandidatura(vagaId) {
    try {
        const data = await window.API.verificarCandidatura(vagaId, getUserId());
        return data.jaCandidatado;
    } catch (error) {
        return false;
    }
}

// Função para obter ID do usuário (substitua pela sua lógica de autenticação)
function getUserId() {
    // Preferir AuthLocal se disponível
    if (window.AuthLocal && typeof AuthLocal.getCurrentUser === 'function'){
        const u = AuthLocal.getCurrentUser();
        if (u && u.id) return u.id;
    }
    // Exemplo legado: pega do localStorage
    return localStorage.getItem('user_id') || 1;
}

// Função para mostrar erro
function showVagasError(message) {
    const grid = document.getElementById("vagas-grid");
    if (grid) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro ao carregar vagas</h3>
                <p>${message}</p>
                <button onclick="loadVagasDepartamento(${currentDepartamentoId})" class="candidatar-btn">
                    Tentar Novamente
                </button>
            </div>
        `;
    }
}

// Carrega vagas quando a tela de departamento é aberta
window.addEventListener('screenChanged', (event) => {
    if (event.detail.screen === 'departamento' && window.getCurrentDepartamentoId) {
        const deptoId = window.getCurrentDepartamentoId();
        if (deptoId) {
            loadVagasDepartamento(deptoId);
        }
    }
});

// Exporta funções para uso global
window.loadVagasDepartamento = loadVagasDepartamento;
window.candidatarVaga = candidatarVaga;

console.log("Departamento Candidato carregado!");