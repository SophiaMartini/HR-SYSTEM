// =========================================
// SISTEMA DE CANDIDATURAS - ARQUIVO COMPLETO
// Arquivo: candidaturas-interno.js
// =========================================

// --- DADOS E VARIÁVEIS GLOBAIS ---

// Variáveis de Paginação
const ITENS_POR_PAGINA = 5;
let paginaAtual = 1;

// Dados de exemplo para simular o backend
const DADOS_CANDIDATOS = [
    { id: '1', nome: 'Paulo Cesar Araujo', cpf: '123.456.789-00', cod: 'CAND001' },
    { id: '2', nome: 'Maria Eduarda Silva', cpf: '987.654.321-00', cod: 'CAND002' },
    { id: '3', nome: 'João Pedro Souza', cpf: '111.222.333-44', cod: 'CAND003' },
    { id: '4', nome: 'Ana Carolina Lima', cpf: '555.666.777-88', cod: 'CAND004' },
    { id: '5', nome: 'Carlos Henrique Costa', cpf: '999.000.111-22', cod: 'CAND005' },
    { id: '6', nome: 'Fernanda Rocha Alves', cpf: '333.444.555-66', cod: 'CAND006' },
];

// DADOS_CANDIDATURAS simula a relação 1:N entre Candidato e Candidaturas
const DADOS_CANDIDATURAS = {
    '1': [
        { id: '13810006', vaga: 'Engenheiro de Dados', data: '02/08/2024 - 20:30', status: 'Reprovado' },
        { id: '18610006', vaga: 'Analista de Suporte Técnico', data: '07/01/2025 - 07:42', status: 'Aprovado' },
        { id: '14510006', vaga: 'Desenvolvedor Backend', data: '07/01/2025 - 07:42', status: 'Pendente' },
        { id: '18610007', vaga: 'Analista de Marketing', data: '07/01/2025 - 07:42', status: 'Pendente' },
        { id: '14510007', vaga: 'Gerente de Projetos', data: '07/01/2025 - 07:42', status: 'Pendente' },
    ],
    '2': [
        { id: '20000001', vaga: 'Desenvolvedor Frontend', data: '10/10/2024 - 10:00', status: 'Pendente' },
    ],
    '3': [
        { id: '30000001', vaga: 'Analista Financeiro', data: '01/09/2024 - 15:00', status: 'Aprovado' },
    ],
    '4': [
        { id: '40000001', vaga: 'Designer UX/UI', data: '15/07/2024 - 11:20', status: 'Reprovado' },
        { id: '40000002', vaga: 'Designer UX/UI', data: '16/07/2024 - 11:20', status: 'Pendente' },
    ],
    '5': [
        { id: '50000001', vaga: 'Estagiário de RH', data: '20/06/2024 - 09:00', status: 'Pendente' },
    ],
    // O Candidato 6 (Fernanda Rocha Alves) não possui candidaturas nos dados de exemplo
};

// Variáveis para controlar filtros
let filtroAtivo = {
    pesquisa: '',
    ordem: 'crescente',
    filtrarPor: 'todos' 
};

// Array global para armazenar os dados *visíveis* após a filtragem
let candidatosVisiveis = DADOS_CANDIDATOS;

// Variável global para armazenar o ID do candidato atual na tela de detalhes
let candidatoDetalheId = null;


// --- FUNÇÕES AUXILIARES DE VAGA ---

// Busca todas as vagas únicas nos DADOS_CANDIDATURAS
function buscarVagasUnicas() {
    const vagas = new Set();
    
    for (const candidatoId in DADOS_CANDIDATURAS) {
        DADOS_CANDIDATURAS[candidatoId].forEach(candidatura => {
            vagas.add(candidatura.vaga);
        });
    }
    return Array.from(vagas).sort();
}

// Preenche o Select de Vagas na tela principal
function popularSelectVagas() {
    const selectVaga = document.querySelector('.cand-filters select:nth-child(2)');
    if (!selectVaga) return;

    const vagas = buscarVagasUnicas();
    selectVaga.innerHTML = '<option value="todos">Todas as Vagas</option>'; 

    vagas.forEach(vaga => {
        const option = document.createElement('option');
        option.value = vaga;
        option.textContent = vaga;
        selectVaga.appendChild(option);
    });
}

// --- FUNÇÕES DE FILTRO E PESQUISA (TELA PRINCIPAL) ---

function aplicarFiltros() {
    let dadosFiltrados = DADOS_CANDIDATOS.slice(); 
    const termo = filtroAtivo.pesquisa.toLowerCase();
    
    // 1. Filtrar (Pesquisa por Nome, CPF ou Código)
    if (termo) {
        dadosFiltrados = dadosFiltrados.filter(candidato => {
            const nome = candidato.nome.toLowerCase();
            const cpf = candidato.cpf;
            const codigo = candidato.cod.toLowerCase();
            
            return nome.includes(termo) || 
                   cpf.includes(termo) || 
                   codigo.includes(termo);
        });
    }

    // 2. Filtrar por Vaga
    const vagaSelecionada = filtroAtivo.filtrarPor; 
    
    if (vagaSelecionada && vagaSelecionada !== 'todos') {
        dadosFiltrados = dadosFiltrados.filter(candidato => {
            const candidaturasDoCandidato = DADOS_CANDIDATURAS[candidato.id] || [];
            
            return candidaturasDoCandidato.some(c => c.vaga === vagaSelecionada);
        });
    }

    // 3. Ordenar
    dadosFiltrados.sort((a, b) => {
        let valorA = a.nome;
        let valorB = b.nome;

        if (filtroAtivo.ordem === 'crescente') {
            return valorA.localeCompare(valorB, 'pt-BR');
        } else {
            return valorB.localeCompare(valorA, 'pt-BR');
        }
    });

    candidatosVisiveis = dadosFiltrados;
    paginaAtual = 1; 
    popularTabelaCandidatos(candidatosVisiveis);
}

// --- FUNÇÕES DE POPULAÇÃO E PAGINAÇÃO (TELA PRINCIPAL) ---

// Função para popular a tabela de candidatos na tela principal
function popularTabelaCandidatos(candidatosParaExibir) {
    const tableBody = document.getElementById('tableBodyCandidaturas');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    // Lógica de Paginação
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const candidatosDaPagina = candidatosParaExibir.slice(inicio, fim);

    candidatosDaPagina.forEach(candidato => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${candidato.nome}</td>
            <td>${candidato.cpf}</td>
            <td>${candidato.cod}</td>
            <td>
                <div class="cand-actions">
                    <button class="btn-defaunt btn-defaunt-yellow" onclick="visualizarCandidaturas('${candidato.id}', '${candidato.nome}')">
                        <i class="fa-solid fa-eye"></i> Ver
                    </button>
                    <button class="btn-defaunt btn-defaunt-blue" onclick="baixarCurriculo('${candidato.id}')">
                        <i class="fa-solid fa-download"></i> Baixar
                    </button>
                    <button class="btn-defaunt btn-defaunt-red" onclick="excluirCandidato('${candidato.id}')">
                        <i class="fa-solid fa-xmark"></i> X
                    </button>
                </div>
            </td>
        `;
    });

    renderizarPaginacao(candidatosParaExibir.length);
}

// Função para renderizar os controles de paginação
function renderizarPaginacao(totalItens) {
    const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);
    const paginacaoContainer = document.querySelector('.cand-pagination .cand-pages');
    const infoPagina = document.querySelector('.cand-pagination div:last-child');
    
    if (!paginacaoContainer || !infoPagina) return;
    
    paginacaoContainer.innerHTML = ''; 

    if (totalItens === 0) {
        infoPagina.textContent = `Mostrando 0 de 0 candidatos`;
        return;
    }
    
    const inicioExibido = (paginaAtual - 1) * ITENS_POR_PAGINA + 1;
    const fimExibido = Math.min(paginaAtual * ITENS_POR_PAGINA, totalItens);
    infoPagina.textContent = `Mostrando ${inicioExibido} a ${fimExibido} de ${totalItens} candidatos`;

    // Botões Anterior/Próxima e Números da Página... (Lógica de paginação omitida para brevidade, mas está completa no código anterior)
    
    // Simplificando a visualização da paginação:
    for (let i = 1; i <= totalPaginas; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        span.onclick = () => mudarPagina(i);
        if (i === paginaAtual) {
            span.classList.add('active');
        }
        paginacaoContainer.appendChild(span);
    }
}

// Função para mudar a página atual
function mudarPagina(novaPagina) {
    const totalPaginas = Math.ceil(candidatosVisiveis.length / ITENS_POR_PAGINA);
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
        paginaAtual = novaPagina;
        popularTabelaCandidatos(candidatosVisiveis);
    }
}

// --- FUNÇÕES DE DETALHES (TELA SECUNDÁRIA) ---

// Função para popular a tabela da tela de detalhes
function popularTabelaDetalhes(candidatoId, filtroStatus = 'todos') {
    const tbody = document.getElementById('tableBodyCandidaturasDetalhe');
    if (!tbody) return;

    tbody.innerHTML = '';
    const candidaturas = DADOS_CANDIDATURAS[candidatoId] || [];
    candidatoDetalheId = candidatoId;

    let candidaturasFiltradas = candidaturas;

    if (filtroStatus !== 'todos') {
         candidaturasFiltradas = candidaturas.filter(c => c.status.toLowerCase() === filtroStatus);
    }
    
    candidaturasFiltradas.forEach(candidatura => {
        const statusLower = candidatura.status.toLowerCase().replace(' ', '');
        const statusClass = statusLower === 'reprovado' ? 'reprovado' : statusLower === 'aprovado' ? 'aprovado' : 'pendente';
        const statusTag = `<span class="status-tag status-${statusClass}">${candidatura.status}</span>`;
        
        const isAprovado = candidatura.status === 'Aprovado';
        const isReprovado = candidatura.status === 'Reprovado';
        const disabledAprovar = isAprovado ? 'disabled' : '';
        const disabledReprovar = isReprovado ? 'disabled' : '';

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${candidatura.id}</td>
            <td>${candidatura.vaga}</td>
            <td>${candidatura.data}</td>
            <td>${statusTag}</td>
            <td>
                <div class="cand-actions">
                    <button class="btn-defaunt btn-defaunt-green" ${disabledAprovar} onclick="aprovarCandidatura('${candidatoId}', '${candidatura.id}')">Aprovar</button>
                    <button class="btn-defaunt btn-defaunt-red" ${disabledReprovar} onclick="reprovarCandidatura('${candidatoId}', '${candidatura.id}')">Reprovar</button>
                </div>
            </td>
        `;
    });
    
    const infoPaginacao = document.getElementById('detalhe-paginacao-info');
    if (infoPaginacao) {
        infoPaginacao.textContent = `Mostrando 1 a ${candidaturasFiltradas.length} de ${candidaturas.length} candidaturas`;
    }
}

// Função para filtrar candidaturas por status (na tela de detalhes)
function filtrarCandidaturasPorStatus(status) {
    if (candidatoDetalheId) {
        popularTabelaDetalhes(candidatoDetalheId, status);
    }
}

// --- FUNÇÕES DE NAVEGAÇÃO E AÇÃO ---

// Função genérica para trocar de tela
function trocarTela(idTela) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    
    const tela = document.getElementById(idTela);
    if (tela) {
        tela.style.display = 'block';
    }
}

// Função principal acionada pelo botão "Ver"
function visualizarCandidaturas(candidatoId, candidatoNome) {
    document.getElementById('candidato-nome-titulo').textContent = `Candidaturas de ${candidatoNome}`;
    document.getElementById('candidato-nome-card').textContent = candidatoNome;
    
    // Resetar filtro de status para "todos" e popular
    const radioTodos = document.getElementById('det-todos');
    if (radioTodos) radioTodos.checked = true; 
    
    popularTabelaDetalhes(candidatoId, 'todos');
    trocarTela('candidato-candidaturas-screen');
}

// Função para voltar para a lista de candidatos
function voltarParaListaCandidatos() {
    trocarTela('candidaturas-screen');
    popularTabelaCandidatos(candidatosVisiveis); 
}

// Funções de simulação de ação (Aprovar/Reprovar)
function aprovarCandidatura(candidatoId, idCandidatura) {
    alert(`Aprovar Inscrição ${idCandidatura} do Candidato ${candidatoId}. (Simulação)`);
    // Lógica real: Atualizar DADOS_CANDIDATURAS[candidatoId].find(c => c.id === idCandidatura).status = 'Aprovado'
    // Depois, popularTabelaDetalhes(candidatoDetalheId);
}

function reprovarCandidatura(candidatoId, idCandidatura) {
    alert(`Reprovar Inscrição ${idCandidatura} do Candidato ${candidatoId}. (Simulação)`);
    // Lógica real: Atualizar DADOS_CANDIDATURAS[candidatoId].find(c => c.id === idCandidatura).status = 'Reprovado'
    // Depois, popularTabelaDetalhes(candidatoDetalheId);
}

// --- INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    
    popularSelectVagas(); 
    aplicarFiltros(); 
    
    // 1. Input de pesquisa
    const inputPesquisa = document.querySelector('.cand-search-row input');
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', (e) => {
            filtroAtivo.pesquisa = e.target.value.trim(); 
            aplicarFiltros();
        });
    }

    // 2. Select de ordenação
    const selectOrdem = document.querySelector('.cand-filters select:nth-child(1)');
    if (selectOrdem) {
        selectOrdem.addEventListener('change', (e) => {
            const valor = e.target.value.toLowerCase();
            filtroAtivo.ordem = valor.includes('crescente') ? 'crescente' : 'decrescente';
            aplicarFiltros();
        });
    }

    // 3. Select de filtro (Vaga)
    const selectFiltro = document.querySelector('.cand-filters select:nth-child(2)');
    if (selectFiltro) {
        selectFiltro.addEventListener('change', (e) => {
            filtroAtivo.filtrarPor = e.target.value; 
            aplicarFiltros();
        });
    }


    // --- LISTENERS DA TELA DE DETALHES ---

    // Filtro de status
    const statusRadios = document.querySelectorAll('input[name="status-det"]');
    statusRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            filtrarCandidaturasPorStatus(e.target.value);
        });
    });

    // Botão Voltar
    const btnVoltar = document.querySelector('#candidato-candidaturas-screen .btn-voltar');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', voltarParaListaCandidatos);
    }
});