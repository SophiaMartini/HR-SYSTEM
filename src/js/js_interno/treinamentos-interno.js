// treinamentos-colaborador.js - Versão com mesma estrutura do interno
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de Treinamentos do Colaborador iniciado!');
    
    // Usar os mesmos dados do sistema interno
    let treinamentos = JSON.parse(localStorage.getItem('rh_treinamentos') || '[]');
    let treinamentoAtualColaborador = null;
    let colaboradorId = 1; // ID do colaborador logado (em produção, viria do login)
    let aulaParaConcluir = null;
    
    // ============ FUNÇÕES DE NAVEGAÇÃO (igual ao interno) ============
    window.mostrarTelaColaborador = function(telaId) {
        console.log('🔄 Mostrando tela:', telaId);
        
        document.querySelectorAll('.screen').forEach(screen => {
            if (screen.id.includes('colaborador') || screen.id === telaId) {
                screen.style.display = 'none';
            }
        });
        
        const tela = document.getElementById(telaId);
        if (tela) {
            tela.style.display = 'block';
            window.scrollTo(0, 0);
            
            if (telaId === 'treinamentos-colaborador-screen') {
                carregarGridTreinamentosColaborador();
            } else if (telaId === 'visualizar-treinamento-colaborador-screen') {
                if (treinamentoAtualColaborador) {
                    carregarDadosVisualizacaoColaborador();
                }
            }
        }
    };
    
    // ============ CARREGAR GRID DE TREINAMENTOS (similar ao interno) ============
    function carregarGridTreinamentosColaborador() {
        const grid = document.getElementById('treinamentos_colaborador_grid');
        if (!grid) return;
        
        // Filtrar apenas treinamentos atribuídos a este colaborador
        const treinamentosColaborador = treinamentos.filter(treinamento => {
            const colaboradores = treinamento.colaboradoresAtribuidos || [];
            return colaboradores.some(colab => colab.id === colaboradorId);
        });
        
        if (treinamentosColaborador.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: #666;">
                    <i class="fas fa-graduation-cap" style="font-size: 4rem; margin-bottom: 1.5rem; color: #ddd;"></i>
                    <h3 style="margin: 0 0 0.5rem 0;">Nenhum treinamento atribuído</h3>
                    <p style="margin: 0 0 1.5rem 0;">Quando novos treinamentos forem atribuídos, eles aparecerão aqui.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        treinamentosColaborador.forEach(treinamento => {
            const colaboradorInfo = treinamento.colaboradoresAtribuidos?.find(c => c.id === colaboradorId);
            const progresso = colaboradorInfo?.progresso || 0;
            
            // Calcular total de aulas
            const totalAulas = treinamento.modulos ? 
                treinamento.modulos.reduce((total, modulo) => total + (modulo.aulas?.length || 0), 0) : 0;
            
            html += `
                <div class="card_treinamento" onclick="visualizarTreinamentoColaborador('${treinamento.id}')">
                    <div class="capa_treinamento" style="height: 150px;">
                        ${treinamento.capa ? 
                            `<img src="${treinamento.capa}" alt="${treinamento.titulo}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                            `<i class="fas fa-graduation-cap" style="font-size: 3rem; color: white;"></i>`
                        }
                        <span style="position: absolute; top: 10px; right: 10px; background: ${progresso === 100 ? '#4CAF50' : progresso > 0 ? '#2196F3' : '#666'}; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                            ${progresso === 100 ? 'Concluído' : progresso > 0 ? 'Em andamento' : 'Não iniciado'}
                        </span>
                    </div>
                    
                    <div class="card-conteudo" style="padding: 1.5rem;">
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem; color: #333;">${treinamento.titulo}</h3>
                        <p style="color: #666; margin-bottom: 1rem; font-size: 0.95rem;">${treinamento.descricao ? (treinamento.descricao.substring(0, 100) + (treinamento.descricao.length > 100 ? '...' : '')) : 'Sem descrição'}</p>
                        
                        <div class="card-info" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin: 1rem 0;">
                            <div class="card-info-item" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #555;">
                                <i class="fas fa-chalkboard-teacher"></i>
                                <span>${treinamento.instrutorNome}</span>
                            </div>
                            <div class="card-info-item" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #555;">
                                <i class="fas fa-clock"></i>
                                <span>${treinamento.cargaHoraria}h</span>
                            </div>
                            <div class="card-info-item" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #555;">
                                <i class="fas fa-book-open"></i>
                                <span>${totalAulas} aulas</span>
                            </div>
                            <div class="card-info-item" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #555;">
                                <i class="fas fa-percentage"></i>
                                <span>${progresso}% concluído</span>
                            </div>
                        </div>
                        
                        <div class="card-acoes">
                            <button class="btn-visualizar" onclick="visualizarTreinamentoColaborador('${treinamento.id}')">
                                <i class="fas fa-eye"></i> Acessar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML = html;
    }
    
    // ============ VISUALIZAR TREINAMENTO (similar ao interno) ============
    window.visualizarTreinamentoColaborador = function(treinamentoId) {
        treinamentoAtualColaborador = treinamentos.find(t => t.id === treinamentoId);
        if (!treinamentoAtualColaborador) {
            alert('❌ Treinamento não encontrado!');
            return;
        }
        
        console.log('👁️ Visualizando treinamento como colaborador:', treinamentoAtualColaborador.titulo);
        
        // Verificar se o colaborador está atribuído a este treinamento
        const colaboradorInfo = treinamentoAtualColaborador.colaboradoresAtribuidos?.find(c => c.id === colaboradorId);
        if (!colaboradorInfo) {
            alert('❌ Você não tem acesso a este treinamento!');
            return;
        }
        
        mostrarTelaColaborador('visualizar-treinamento-colaborador-screen');
    };
    
    // ============ CARREGAR DADOS DE VISUALIZAÇÃO (similar ao interno) ============
    function carregarDadosVisualizacaoColaborador() {
        if (!treinamentoAtualColaborador) return;
        
        // Preencher informações básicas (igual ao interno)
        document.getElementById('tituloTreinamentoColaborador').textContent = treinamentoAtualColaborador.titulo;
        document.getElementById('descricaoTreinamentoColaborador').textContent = treinamentoAtualColaborador.descricao || 'Sem descrição';
        document.getElementById('cargaHorariaColaborador').textContent = treinamentoAtualColaborador.cargaHoraria;
        document.getElementById('instrutorTreinamentoColaborador').textContent = treinamentoAtualColaborador.instrutorNome || 'Não definido';
        
        // Calcular total de aulas
        const totalAulas = calcularTotalAulasTreinamento(treinamentoAtualColaborador);
        document.getElementById('totalAulasColaborador').textContent = totalAulas;
        
        // Calcular progresso do colaborador
        const colaboradorInfo = treinamentoAtualColaborador.colaboradoresAtribuidos?.find(c => c.id === colaboradorId);
        const progressoAtual = colaboradorInfo?.progresso || 0;
        document.getElementById('progressoGeral').textContent = `${progressoAtual}%`;
        
        // Carregar módulos e aulas
        carregarModulosVisualizacaoColaborador();
    }
    
    function calcularTotalAulasTreinamento(treinamento) {
        if (!treinamento.modulos) return 0;
        return treinamento.modulos.reduce((total, modulo) => 
            total + (modulo.aulas?.length || 0), 0
        );
    }
    
    function carregarModulosVisualizacaoColaborador() {
        const container = document.getElementById('listaModulosColaborador');
        if (!container || !treinamentoAtualColaborador.modulos) {
            container.innerHTML = '<p>Nenhum módulo disponível.</p>';
            return;
        }
        
        const colaboradorInfo = treinamentoAtualColaborador.colaboradoresAtribuidos?.find(c => c.id === colaboradorId);
        const aulasConcluidas = colaboradorInfo?.aulasConcluidas || [];
        
        let html = '';
        treinamentoAtualColaborador.modulos.forEach((modulo, moduloIndex) => {
            const totalAulasModulo = modulo.aulas?.length || 0;
            const aulasConcluidasModulo = modulo.aulas?.filter(aula => aulasConcluidas.includes(aula.id)).length || 0;
            const moduloConcluido = aulasConcluidasModulo === totalAulasModulo && totalAulasModulo > 0;
            
            html += `
                <div class="modulo-visualizacao ${moduloConcluido ? 'modulo-concluido' : ''}">
                    <div class="modulo-header-visualizacao" onclick="toggleModuloColaborador(this)">
                        <h4>
                            <i class="fas fa-folder ${moduloConcluido ? 'text-success' : ''}"></i>
                            Módulo ${moduloIndex + 1}: ${modulo.titulo}
                            <span class="modulo-contador">${totalAulasModulo} aulas</span>
                            ${moduloConcluido ? '<span style="background: #4CAF50; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; font-weight: 600; margin-left: 10px;">Concluído</span>' : ''}
                        </h4>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    
                    ${modulo.descricao ? `
                        <div class="modulo-descricao-visualizacao">
                            <p>${modulo.descricao}</p>
                        </div>
                    ` : ''}
                    
                    <div class="aulas-container-visualizacao">
                        ${carregarAulasModuloColaborador(modulo, moduloIndex, aulasConcluidas)}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p>Nenhum módulo disponível.</p>';
    }
    
    function carregarAulasModuloColaborador(modulo, moduloIndex, aulasConcluidas) {
        if (!modulo.aulas || modulo.aulas.length === 0) {
            return '<p class="sem-aulas">Nenhuma aula neste módulo.</p>';
        }
        
        let html = '';
        modulo.aulas.forEach((aula, aulaIndex) => {
            const aulaConcluida = aulasConcluidas.includes(aula.id);
            
            html += `
                <div class="aula-visualizacao ${aulaConcluida ? 'aula-concluida' : ''}" data-aula-id="${aula.id}">
                    <div class="aula-header-visualizacao">
                        <h5>
                            <i class="fas fa-play-circle ${aulaConcluida ? 'text-success' : 'text-warning'}"></i>
                            Aula ${moduloIndex + 1}.${aulaIndex + 1}: ${aula.titulo}
                            ${aulaConcluida ? '<span style="background: #4CAF50; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; font-weight: 600; margin-left: 10px;"><i class="fas fa-check"></i> Concluída</span>' : ''}
                        </h5>
                        <div class="aula-info">
                            <span><i class="fas fa-file"></i> ${aula.tipo}</span>
                        </div>
                    </div>
                    
                    ${aula.descricao ? `
                        <div class="aula-descricao-visualizacao">
                            <p>${aula.descricao}</p>
                        </div>
                    ` : ''}
                    
                    <div class="aula-conteudo-visualizacao">
                        ${gerarConteudoAulaColaborador(aula)}
                    </div>
                    
                    ${!aulaConcluida ? `
                        <div class="progresso-aula-alunos" style="margin-top: 1rem; border-top: 2px solid #e6e8d3; padding-top: 1rem;">
                            <button class="btn-defaunt" onclick="abrirModalConclusaoAula('${aula.id}')">
                                <i class="fas fa-check"></i> Marcar como Concluída
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        return html;
    }
    
    function gerarConteudoAulaColaborador(aula) {
        switch(aula.tipo) {
            case 'texto':
                return `<div class="conteudo-texto">${aula.conteudo || 'Sem conteúdo textual.'}</div>`;
            case 'video':
                return aula.url ? `
                    <div class="conteudo-video">
                        <a href="${aula.url}" target="_blank" class="material-link">
                            <i class="fab fa-youtube"></i> Assistir vídeo
                        </a>
                    </div>
                ` : '<p>URL do vídeo não disponível.</p>';
            case 'pdf':
                return `<div class="conteudo-pdf">
                            <a href="#" class="material-link">
                                <i class="fas fa-file-pdf"></i> Baixar PDF
                            </a>
                        </div>`;
            case 'link':
                return aula.url ? `
                    <div class="conteudo-link">
                        <a href="${aula.url}" target="_blank" class="material-link">
                            <i class="fas fa-external-link-alt"></i> Acessar link
                        </a>
                    </div>
                ` : '<p>URL não disponível.</p>';
            case 'forms':
                return aula.url ? `
                    <div class="conteudo-forms">
                        <a href="${aula.url}" target="_blank" class="material-link">
                            <i class="fab fa-google"></i> Preencher formulário
                        </a>
                    </div>
                ` : '<p>URL do formulário não disponível.</p>';
            default:
                return '<p>Tipo de conteúdo não reconhecido.</p>';
        }
    }
    
    // ============ FUNÇÕES PARA AS ABAS (igual ao interno) ============
    window.mudarAbaColaborador = function(abaId) {
        console.log(`📂 Mudando para aba: ${abaId}`);
        
        document.querySelectorAll('.aba-conteudo-treinamento').forEach(aba => {
            aba.style.display = 'none';
        });
        
        document.querySelectorAll('.aba-treinamento').forEach(botao => {
            botao.classList.remove('active');
        });
        
        const aba = document.getElementById(`aba-${abaId}-colaborador`);
        const botao = document.querySelector(`[data-aba="${abaId}"]`);
        
        if (aba) {
            aba.style.display = 'block';
        }
        
        if (botao) {
            botao.classList.add('active');
        }
    };
    
    // ============ TOGGLE MODULO (igual ao interno) ============
    window.toggleModuloColaborador = function(element) {
        const modulo = element.closest('.modulo-visualizacao');
        const aulasContainer = modulo.querySelector('.aulas-container-visualizacao');
        const icone = element.querySelector('.fa-chevron-down');
        
        if (aulasContainer.style.display === 'block') {
            aulasContainer.style.display = 'none';
            icone.classList.remove('fa-chevron-up');
            icone.classList.add('fa-chevron-down');
        } else {
            aulasContainer.style.display = 'block';
            icone.classList.remove('fa-chevron-down');
            icone.classList.add('fa-chevron-up');
        }
    };
    
    // ============ SISTEMA DE CONCLUSÃO DE AULAS ============
    window.abrirModalConclusaoAula = function(aulaId) {
        if (!treinamentoAtualColaborador) return;
        
        // Encontrar a aula
        let aulaEncontrada = null;
        let moduloEncontrado = null;
        
        for (const modulo of treinamentoAtualColaborador.modulos) {
            if (modulo.aulas) {
                const aula = modulo.aulas.find(a => a.id === aulaId);
                if (aula) {
                    aulaEncontrada = aula;
                    moduloEncontrado = modulo;
                    break;
                }
            }
        }
        
        if (!aulaEncontrada) {
            alert('❌ Aula não encontrada!');
            return;
        }
        
        aulaParaConcluir = {
            id: aulaId,
            titulo: aulaEncontrada.titulo,
            descricao: aulaEncontrada.descricao || `Concluir aula: ${aulaEncontrada.titulo}`
        };
        
        // Preencher modal
        document.getElementById('tituloAulaModal').textContent = aulaEncontrada.titulo;
        document.getElementById('descricaoAulaModal').textContent = 
            `Deseja marcar esta aula como concluída?`;
        
        // Resetar checkbox
        document.getElementById('confirmarConclusao').checked = false;
        document.getElementById('btnConcluirAula').disabled = true;
        
        // Mostrar modal
        document.getElementById('modalConclusaoAula').style.display = 'flex';
    };
    
    window.fecharModalConclusao = function() {
        document.getElementById('modalConclusaoAula').style.display = 'none';
        aulaParaConcluir = null;
    };
    
    window.concluirAulaConfirmada = function() {
        if (!aulaParaConcluir || !treinamentoAtualColaborador) return;
        
        // Atualizar progresso no treinamento atual
        const colaboradorInfo = treinamentoAtualColaborador.colaboradoresAtribuidos?.find(c => c.id === colaboradorId);
        
        if (!colaboradorInfo) {
            alert('❌ Erro: Informações do colaborador não encontradas!');
            return;
        }
        
        // Inicializar array de aulas concluídas se não existir
        if (!colaboradorInfo.aulasConcluidas) {
            colaboradorInfo.aulasConcluidas = [];
        }
        
        // Adicionar aula ao array (se ainda não estiver)
        if (!colaboradorInfo.aulasConcluidas.includes(aulaParaConcluir.id)) {
            colaboradorInfo.aulasConcluidas.push(aulaParaConcluir.id);
            
            // Calcular novo progresso
            const totalAulas = calcularTotalAulasTreinamento(treinamentoAtualColaborador);
            const progresso = Math.round((colaboradorInfo.aulasConcluidas.length / totalAulas) * 100);
            
            // Atualizar progresso
            colaboradorInfo.progresso = progresso;
            
            // Atualizar status se necessário
            if (progresso === 100) {
                colaboradorInfo.status = 'Concluído';
                colaboradorInfo.dataConclusao = new Date().toISOString();
            } else if (progresso > 0 && colaboradorInfo.status === 'Inscrito') {
                colaboradorInfo.status = 'Em andamento';
            }
            
            // Salvar no localStorage
            const index = treinamentos.findIndex(t => t.id === treinamentoAtualColaborador.id);
            if (index !== -1) {
                treinamentos[index] = treinamentoAtualColaborador;
                localStorage.setItem('rh_treinamentos', JSON.stringify(treinamentos));
            }
            
            console.log(`✅ Aula "${aulaParaConcluir.titulo}" concluída! Progresso: ${progresso}%`);
            
            // Fechar modal e recarregar visualização
            fecharModalConclusao();
            
            // Recarregar a visualização do treinamento
            carregarDadosVisualizacaoColaborador();
            
            alert(`✅ Aula concluída com sucesso!\n\nProgresso atual: ${progresso}%`);
        } else {
            alert('ℹ️ Esta aula já foi marcada como concluída anteriormente.');
            fecharModalConclusao();
        }
    };
    
    // ============ FILTRAR TREINAMENTOS (igual ao interno) ============
    function filtrarTreinamentosColaborador() {
        const busca = document.getElementById('buscaTreinamentoColaborador').value.toLowerCase();
        const status = document.getElementById('statusFiltroColaborador').value;
        
        const cards = document.querySelectorAll('#treinamentos_colaborador_grid .card_treinamento');
        
        cards.forEach(card => {
            const titulo = card.querySelector('h3').textContent.toLowerCase();
            const statusBadge = card.querySelector('.card-acoes span')?.textContent.toLowerCase() || '';
            
            let mostrar = true;
            
            if (busca && !titulo.includes(busca)) {
                mostrar = false;
            }
            
            if (status) {
                if (status === 'concluido' && !statusBadge.includes('concluído')) mostrar = false;
                if (status === 'andamento' && !statusBadge.includes('andamento')) mostrar = false;
                if (status === 'nao-iniciado' && !statusBadge.includes('não iniciado')) mostrar = false;
            }
            
            card.style.display = mostrar ? 'block' : 'none';
        });
    }
    
    // ============ INICIALIZAÇÃO ============
    function inicializarColaborador() {
        // Configurar eventos
        const buscaInput = document.getElementById('buscaTreinamentoColaborador');
        if (buscaInput) {
            buscaInput.addEventListener('input', filtrarTreinamentosColaborador);
        }
        
        const statusFiltro = document.getElementById('statusFiltroColaborador');
        if (statusFiltro) {
            statusFiltro.addEventListener('change', filtrarTreinamentosColaborador);
        }
        
        // Configurar checkbox de confirmação
        const confirmarCheckbox = document.getElementById('confirmarConclusao');
        if (confirmarCheckbox) {
            confirmarCheckbox.addEventListener('change', function() {
                const btnConcluir = document.getElementById('btnConcluirAula');
                btnConcluir.disabled = !this.checked;
            });
        }
        
        // Se a tela atual for a de treinamentos, carregar o grid
        if (document.getElementById('treinamentos-colaborador-screen').style.display !== 'none') {
            carregarGridTreinamentosColaborador();
        }
    }
    
    // Inicializar quando o DOM estiver pronto
    inicializarColaborador();
});

// Funções globais para o HTML
function abrirModalConclusaoAula(aulaId) {
    if (typeof window.abrirModalConclusaoAula === 'function') {
        window.abrirModalConclusaoAula(aulaId);
    }
}

function fecharModalConclusao() {
    if (typeof window.fecharModalConclusao === 'function') {
        window.fecharModalConclusao();
    }
}

function concluirAulaConfirmada() {
    if (typeof window.concluirAulaConfirmada === 'function') {
        window.concluirAulaConfirmada();
    }
}

function mostrarTelaColaborador(telaId) {
    if (typeof window.mostrarTelaColaborador === 'function') {
        window.mostrarTelaColaborador(telaId);
    }
}

function mudarAbaColaborador(abaId) {
    if (typeof window.mudarAbaColaborador === 'function') {
        window.mudarAbaColaborador(abaId);
    }
}

function toggleModuloColaborador(element) {
    if (typeof window.toggleModuloColaborador === 'function') {
        window.toggleModuloColaborador(element);
    }
}

function visualizarTreinamentoColaborador(treinamentoId) {
    if (typeof window.visualizarTreinamentoColaborador === 'function') {
        window.visualizarTreinamentoColaborador(treinamentoId);
    }
}