// treinamentos-interno.js - Código atualizado com todas as funcionalidades

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de Treinamentos iniciado!');
    
    // Dados iniciais
    let treinamentos = JSON.parse(localStorage.getItem('rh_treinamentos') || '[]');
    let instrutores = JSON.parse(localStorage.getItem('rh_instrutores') || '[]');
    let treinamentoAtual = null;
    let moduloEmEdicao = null;
    let moduloEditIndex = null;
    let instrutorSelecionado = null;
    
    // ============ INICIALIZAÇÃO ============
    function inicializarSistema() {
        carregarInstrutores();
        carregarGridTreinamentos();
        configurarEventos();
        
        // Se não houver instrutores, adicionar alguns exemplos
        if (instrutores.length === 0) {
            adicionarInstrutoresExemplo();
        }
    }
    
    function adicionarInstrutoresExemplo() {
        const exemplos = [
            {
                id: '1',
                nome: 'Carlos Silva',
                email: 'carlos.silva@empresa.com',
                especialidade: 'Liderança e Gestão',
                bio: 'Especialista em desenvolvimento de líderes com 15 anos de experiência.'
            },
            {
                id: '2',
                nome: 'Ana Oliveira',
                email: 'ana.oliveira@empresa.com',
                especialidade: 'Tecnologia e Inovação',
                bio: 'Engenheira de software com foco em transformação digital.'
            },
            {
                id: '3',
                nome: 'Roberto Santos',
                email: 'roberto.santos@empresa.com',
                especialidade: 'Compliance e RH',
                bio: 'Consultor em compliance trabalhista e políticas de RH.'
            }
        ];
        
        instrutores = exemplos;
        localStorage.setItem('rh_instrutores', JSON.stringify(instrutores));
        carregarInstrutores();
    }
    
    // ============ CARREGAR INSTRUTORES ============
    function carregarInstrutores() {
        const select = document.getElementById('instrutorTreinamento');
        if (!select) return;
        
        select.innerHTML = '<option value="">Selecione o instrutor</option>';
        
        instrutores.forEach(instrutor => {
            const option = document.createElement('option');
            option.value = instrutor.id;
            option.textContent = instrutor.nome;
            select.appendChild(option);
        });
        
        // Adicionar opção para buscar mais instrutores
        const optionBuscar = document.createElement('option');
        optionBuscar.value = 'buscar';
        optionBuscar.textContent = '➕ Buscar/Cadastrar Instrutor...';
        select.appendChild(optionBuscar);
        
        select.addEventListener('change', function() {
            if (this.value === 'buscar') {
                this.value = '';
                abrirModalSelecionarInstrutor();
            }
        });
    }
    
    // ============ MODAL DE INSTRUTORES ============
    window.abrirModalSelecionarInstrutor = function() {
        carregarListaInstrutoresModal();
        document.getElementById('modalSelecionarInstrutor').style.display = 'flex';
    };
    
    window.fecharModalInstrutor = function() {
        document.getElementById('modalSelecionarInstrutor').style.display = 'none';
        instrutorSelecionado = null;
    };
    
    function carregarListaInstrutoresModal() {
        const container = document.getElementById('listaInstrutoresModal');
        container.innerHTML = '';
        
        instrutores.forEach(instrutor => {
            const div = document.createElement('div');
            div.className = 'instrutor-item-modal';
            div.dataset.id = instrutor.id;
            div.onclick = () => selecionarInstrutorModal(instrutor.id);
            
            if (instrutorSelecionado && instrutorSelecionado.id === instrutor.id) {
                div.classList.add('selecionado');
            }
            
            div.innerHTML = `
                <i class="fas fa-chalkboard-teacher"></i>
                <div class="instrutor-info-modal">
                    <h4>${instrutor.nome}</h4>
                    <p>${instrutor.especialidade || 'Sem especialidade definida'}</p>
                    <small>${instrutor.email || ''}</small>
                </div>
            `;
            
            container.appendChild(div);
        });
    }
    
    function selecionarInstrutorModal(id) {
        instrutorSelecionado = instrutores.find(i => i.id === id);
        
        // Remover seleção anterior
        document.querySelectorAll('.instrutor-item-modal').forEach(item => {
            item.classList.remove('selecionado');
        });
        
        // Adicionar seleção atual
        const item = document.querySelector(`.instrutor-item-modal[data-id="${id}"]`);
        if (item) {
            item.classList.add('selecionado');
        }
    }
    
    window.filtrarInstrutores = function() {
        const busca = document.getElementById('buscaInstrutor').value.toLowerCase();
        const items = document.querySelectorAll('.instrutor-item-modal');
        
        items.forEach(item => {
            const nome = item.querySelector('h4').textContent.toLowerCase();
            const especialidade = item.querySelector('p').textContent.toLowerCase();
            
            if (nome.includes(busca) || especialidade.includes(busca)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    };
    
    window.confirmarInstrutor = function() {
        if (!instrutorSelecionado) {
            alert('Por favor, selecione um instrutor.');
            return;
        }
        
        const select = document.getElementById('instrutorTreinamento');
        select.value = instrutorSelecionado.id;
        
        fecharModalInstrutor();
    };
    
    window.novoInstrutor = function() {
        document.getElementById('modalSelecionarInstrutor').style.display = 'none';
        document.getElementById('modalNovoInstrutor').style.display = 'flex';
    };
    
    window.fecharModalNovoInstrutor = function() {
        document.getElementById('modalNovoInstrutor').style.display = 'none';
        abrirModalSelecionarInstrutor();
    };
    
    window.salvarNovoInstrutor = function() {
        const nome = document.getElementById('nomeInstrutor').value.trim();
        const email = document.getElementById('emailInstrutor').value.trim();
        const especialidade = document.getElementById('especialidadeInstrutor').value.trim();
        const bio = document.getElementById('bioInstrutor').value.trim();
        
        if (!nome) {
            alert('O nome do instrutor é obrigatório.');
            return;
        }
        
        const novoInstrutor = {
            id: Date.now().toString(),
            nome: nome,
            email: email || '',
            especialidade: especialidade || '',
            bio: bio || ''
        };
        
        instrutores.push(novoInstrutor);
        localStorage.setItem('rh_instrutores', JSON.stringify(instrutores));
        
        // Selecionar o novo instrutor
        instrutorSelecionado = novoInstrutor;
        
        // Atualizar o select
        carregarInstrutores();
        
        // Fechar modais
        fecharModalNovoInstrutor();
        fecharModalInstrutor();
        
        // Selecionar o instrutor no formulário
        document.getElementById('instrutorTreinamento').value = novoInstrutor.id;
        
        alert('Instrutor cadastrado com sucesso!');
    };
    
    // ============ MODAL DE MÓDULOS ============
    window.adicionarModulo = function() {
        moduloEmEdicao = null;
        moduloEditIndex = null;
        
        document.getElementById('tituloModalModulo').textContent = 'Adicionar Módulo';
        document.getElementById('nomeModulo').value = '';
        document.getElementById('descricaoModulo').value = '';
        
        // Limpar aulas
        const container = document.getElementById('aulasModuloContainer');
        container.innerHTML = '';
        
        // Adicionar uma aula inicial
        adicionarAulaNoModal();
        
        document.getElementById('modalModulo').style.display = 'flex';
    };
    
    window.editarModulo = function(index) {
        if (!treinamentoAtual || !treinamentoAtual.modulos) return;
        
        moduloEmEdicao = treinamentoAtual.modulos[index];
        moduloEditIndex = index;
        
        document.getElementById('tituloModalModulo').textContent = 'Editar Módulo';
        document.getElementById('nomeModulo').value = moduloEmEdicao.titulo || '';
        document.getElementById('descricaoModulo').value = moduloEmEdicao.descricao || '';
        
        // Carregar aulas
        const container = document.getElementById('aulasModuloContainer');
        container.innerHTML = '';
        
        if (moduloEmEdicao.aulas && moduloEmEdicao.aulas.length > 0) {
            moduloEmEdicao.aulas.forEach((aula, aulaIndex) => {
                adicionarAulaNoModal(aula);
            });
        } else {
            adicionarAulaNoModal();
        }
        
        document.getElementById('modalModulo').style.display = 'flex';
    };
    
    window.fecharModalModulo = function() {
        document.getElementById('modalModulo').style.display = 'none';
        moduloEmEdicao = null;
        moduloEditIndex = null;
    };
    
    window.adicionarAulaNoModal = function(aulaExistente = null) {
        const container = document.getElementById('aulasModuloContainer');
        const aulaId = Date.now() + Math.random();
        
        const aulaItem = document.createElement('div');
        aulaItem.className = 'aula-item-modal';
        aulaItem.dataset.id = aulaId;
        
        aulaItem.innerHTML = `
            <div class="aula-header-modal">
                <h5>Aula ${container.children.length + 1}</h5>
                <button type="button" class="btn-remover-aula-modal" onclick="removerAulaModal('${aulaId}')">
                    <i class="fas fa-times"></i> Remover
                </button>
            </div>
            
            <div class="form-group-sm">
                <label>Título da Aula *</label>
                <input type="text" class="aula-titulo" placeholder="Ex: Introdução aos Conceitos" 
                       value="${aulaExistente ? aulaExistente.titulo || '' : ''}" required>
            </div>
            
            <div class="form-group-sm">
                <label>Descrição</label>
                <textarea class="aula-descricao" rows="2" placeholder="Descreva o conteúdo desta aula...">${aulaExistente ? aulaExistente.descricao || '' : ''}</textarea>
            </div>
            
            <div class="form-group-sm">
                <label>Tipo de Conteúdo *</label>
                <select class="aula-tipo" onchange="mudarTipoAula(this)">
                    <option value="">Selecione o tipo</option>
                    <option value="texto" ${aulaExistente && aulaExistente.tipo === 'texto' ? 'selected' : ''}>Texto/Artigo</option>
                    <option value="video" ${aulaExistente && aulaExistente.tipo === 'video' ? 'selected' : ''}>Vídeo</option>
                    <option value="pdf" ${aulaExistente && aulaExistente.tipo === 'pdf' ? 'selected' : ''}>PDF/Documento</option>
                    <option value="link" ${aulaExistente && aulaExistente.tipo === 'link' ? 'selected' : ''}>Link Externo</option>
                    <option value="forms" ${aulaExistente && aulaExistente.tipo === 'forms' ? 'selected' : ''}>Formulário/Quiz</option>
                </select>
            </div>
            
            <div class="aula-conteudo-container" id="conteudoAula_${aulaId}">
                ${gerarCamposConteudoAula(aulaExistente ? aulaExistente.tipo : '', aulaExistente ? aulaExistente.conteudo || '' : '', aulaExistente ? aulaExistente.url || '' : '')}
            </div>
        `;
        
        container.appendChild(aulaItem);
    };
    
    window.removerAulaModal = function(aulaId) {
        const aulaItem = document.querySelector(`.aula-item-modal[data-id="${aulaId}"]`);
        if (aulaItem) {
            aulaItem.remove();
            
            // Renumerar as aulas
            const aulas = document.querySelectorAll('.aula-item-modal');
            aulas.forEach((aula, index) => {
                const titulo = aula.querySelector('h5');
                titulo.textContent = `Aula ${index + 1}`;
            });
        }
    };
    
    window.mudarTipoAula = function(select) {
        const aulaItem = select.closest('.aula-item-modal');
        const conteudoContainer = aulaItem.querySelector('.aula-conteudo-container');
        const tipo = select.value;
        
        conteudoContainer.innerHTML = gerarCamposConteudoAula(tipo);
    };
    
    function gerarCamposConteudoAula(tipo, conteudo = '', url = '') {
        switch(tipo) {
            case 'texto':
                return `
                    <div class="form-group-sm">
                        <label>Conteúdo Textual</label>
                        <textarea class="aula-conteudo-texto" rows="4" placeholder="Digite o conteúdo da aula...">${conteudo}</textarea>
                    </div>
                `;
            case 'video':
                return `
                    <div class="form-group-sm">
                        <label>URL do Vídeo (YouTube, Vimeo, etc.)</label>
                        <input type="url" class="aula-url" placeholder="https://www.youtube.com/watch?v=..." value="${url}">
                    </div>
                `;
            case 'pdf':
                return `
                    <div class="form-group-sm">
                        <label>Upload do PDF</label>
                        <input type="file" class="aula-arquivo" accept=".pdf">
                        ${conteudo ? `<small>Arquivo atual: ${conteudo}</small>` : ''}
                    </div>
                `;
            case 'link':
                return `
                    <div class="form-group-sm">
                        <label>URL do Link</label>
                        <input type="url" class="aula-url" placeholder="https://www.exemplo.com" value="${url}">
                    </div>
                `;
            case 'forms':
                return `
                    <div class="form-group-sm">
                        <label>URL do Formulário (Google Forms, etc.)</label>
                        <input type="url" class="aula-url" placeholder="https://forms.google.com/..." value="${url}">
                    </div>
                `;
            default:
                return '<p class="text-muted">Selecione um tipo de conteúdo para ver as opções.</p>';
        }
    }
    
    window.salvarModulo = function() {
        const nome = document.getElementById('nomeModulo').value.trim();
        const descricao = document.getElementById('descricaoModulo').value.trim();
        
        if (!nome) {
            alert('O nome do módulo é obrigatório.');
            return;
        }
        
        // Coletar aulas
        const aulasItems = document.querySelectorAll('.aula-item-modal');
        const aulas = [];
        
        let aulaValida = true;
        aulasItems.forEach((item, index) => {
            const titulo = item.querySelector('.aula-titulo').value.trim();
            const descricaoAula = item.querySelector('.aula-descricao').value.trim();
            const tipo = item.querySelector('.aula-tipo').value;
            
            if (!titulo || !tipo) {
                aulaValida = false;
                alert(`A aula ${index + 1} precisa de título e tipo.`);
                return;
            }
            
            let conteudo = '';
            let url = '';
            
            if (tipo === 'texto') {
                conteudo = item.querySelector('.aula-conteudo-texto').value.trim();
            } else if (['video', 'link', 'forms'].includes(tipo)) {
                url = item.querySelector('.aula-url').value.trim();
            }
            
            aulas.push({
                id: Date.now().toString() + index,
                titulo: titulo,
                descricao: descricaoAula,
                tipo: tipo,
                conteudo: conteudo,
                url: url,
                ordem: index + 1
            });
        });
        
        if (!aulaValida) return;
        
        const modulo = {
            id: moduloEmEdicao ? moduloEmEdicao.id : Date.now().toString(),
            titulo: nome,
            descricao: descricao,
            aulas: aulas,
            ordem: moduloEditIndex !== null ? moduloEditIndex + 1 : (treinamentoAtual ? (treinamentoAtual.modulos ? treinamentoAtual.modulos.length + 1 : 1) : 1)
        };
        
        if (!treinamentoAtual.modulos) {
            treinamentoAtual.modulos = [];
        }
        
        if (moduloEditIndex !== null) {
            // Editar módulo existente
            treinamentoAtual.modulos[moduloEditIndex] = modulo;
        } else {
            // Adicionar novo módulo
            treinamentoAtual.modulos.push(modulo);
        }
        
        // Atualizar lista de módulos no formulário
        atualizarListaModulosFormulario();
        
        fecharModalModulo();
    };
    
    function atualizarListaModulosFormulario() {
        const container = document.getElementById('listaModulos');
        if (!container || !treinamentoAtual.modulos) return;
        
        let html = '';
        
        treinamentoAtual.modulos.forEach((modulo, index) => {
            const totalAulas = modulo.aulas ? modulo.aulas.length : 0;
            
            html += `
                <div class="modulo-item" data-index="${index}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">
                            <i class="fas fa-folder"></i>
                            Módulo ${index + 1}: ${modulo.titulo}
                            <small style="color: #666; margin-left: 1rem;">
                                (${totalAulas} ${totalAulas === 1 ? 'aula' : 'aulas'})
                            </small>
                        </h4>
                        <div>
                            <button type="button" class="btn-defaunt btn-sm" onclick="editarModulo(${index})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button type="button" class="btn-remover-modulo" onclick="removerModulo(${index})">
                                <i class="fas fa-trash"></i> Remover
                            </button>
                        </div>
                    </div>
                    
                    ${modulo.descricao ? `
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                            <p style="margin: 0; color: #555;">${modulo.descricao}</p>
                        </div>
                    ` : ''}
                    
                    ${modulo.aulas && modulo.aulas.length > 0 ? `
                        <div class="aulas-container">
                            <h5 style="margin: 1rem 0 0.5rem 0; color: #555;">Aulas:</h5>
                            ${modulo.aulas.map((aula, aulaIndex) => `
                                <div class="aula-item" style="margin-bottom: 1rem;">
                                    <strong>${index + 1}.${aulaIndex + 1} ${aula.titulo}</strong>
                                    <small style="color: #888; margin-left: 1rem;">
                                        <i class="fas fa-${getIconeTipoAula(aula.tipo)}"></i> ${getNomeTipoAula(aula.tipo)}
                                    </small>
                                    ${aula.descricao ? `<p style="margin: 0.25rem 0; color: #666;">${aula.descricao}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        container.innerHTML = html || '<p style="color: #666; text-align: center;">Nenhum módulo adicionado ainda.</p>';
    }
    
    function getIconeTipoAula(tipo) {
        switch(tipo) {
            case 'texto': return 'file-alt';
            case 'video': return 'video';
            case 'pdf': return 'file-pdf';
            case 'link': return 'external-link-alt';
            case 'forms': return 'clipboard-list';
            default: return 'file';
        }
    }
    
    function getNomeTipoAula(tipo) {
        switch(tipo) {
            case 'texto': return 'Texto';
            case 'video': return 'Vídeo';
            case 'pdf': return 'PDF';
            case 'link': return 'Link';
            case 'forms': return 'Formulário';
            default: return 'Arquivo';
        }
    }
    
    window.removerModulo = function(index) {
        if (confirm('Tem certeza que deseja remover este módulo? Todas as aulas serão perdidas.')) {
            treinamentoAtual.modulos.splice(index, 1);
            atualizarListaModulosFormulario();
        }
    };
    
    // ============ FORMULÁRIO DE TREINAMENTO ============
    document.getElementById('cadastroTreinamentoForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        salvarTreinamento();
    });
    
    function salvarTreinamento() {
        const titulo = document.getElementById('tituloTreinamento').value.trim();
        const cargaHoraria = document.getElementById('cargaHoraria').value;
        const instrutorId = document.getElementById('instrutorTreinamento').value;
        const categoria = document.getElementById('categoriaTreinamento').value;
        const descricao = document.getElementById('descricaoTreinamento').value.trim();
        const treinamentoId = document.getElementById('treinamentoId').value;
        
        if (!titulo || !cargaHoraria || !instrutorId || !descricao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        const instrutor = instrutores.find(i => i.id === instrutorId);
        if (!instrutor) {
            alert('Instrutor não encontrado.');
            return;
        }
        
        const treinamento = {
            id: treinamentoId || Date.now().toString(),
            titulo: titulo,
            cargaHoraria: parseInt(cargaHoraria),
            instrutorId: instrutorId,
            instrutorNome: instrutor.nome,
            categoria: categoria,
            descricao: descricao,
            modulos: treinamentoAtual?.modulos || [],
            status: 'ativo',
            dataCriacao: new Date().toISOString(),
            colaboradoresAtribuidos: treinamentoAtual?.colaboradoresAtribuidos || []
        };
        
        // Upload de imagem (simulação)
        const imagemInput = document.getElementById('imagemTreinamento');
        if (imagemInput.files && imagemInput.files[0]) {
            // Em produção, aqui você faria o upload real
            const reader = new FileReader();
            reader.onload = function(e) {
                treinamento.capa = e.target.result;
                finalizarSalvamento(treinamento);
            };
            reader.readAsDataURL(imagemInput.files[0]);
        } else {
            finalizarSalvamento(treinamento);
        }
    }
    
    function finalizarSalvamento(treinamento) {
        if (treinamentoAtual && treinamentoAtual.id) {
            // Editar existente
            const index = treinamentos.findIndex(t => t.id === treinamentoAtual.id);
            if (index !== -1) {
                treinamentos[index] = treinamento;
            }
        } else {
            // Novo treinamento
            treinamentos.push(treinamento);
        }
        
        localStorage.setItem('rh_treinamentos', JSON.stringify(treinamentos));
        
        alert('Treinamento salvo com sucesso!');
        
        // Limpar formulário
        limparFormulario();
        
        // Voltar para a lista
        document.getElementById('cadastro-treinamento-screen').style.display = 'none';
        document.getElementById('treinamentos-screen').style.display = 'block';
        
        // Recarregar grid
        carregarGridTreinamentos();
    }
    
    function limparFormulario() {
        document.getElementById('cadastroTreinamentoForm').reset();
        document.getElementById('treinamentoId').value = '';
        document.getElementById('listaModulos').innerHTML = '';
        treinamentoAtual = null;
    }
    
    // ============ FUNÇÕES DE NAVEGAÇÃO ============
    window.navegarPara = function(telaId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        
        const tela = document.getElementById(telaId);
        if (tela) {
            tela.style.display = 'block';
            window.scrollTo(0, 0);
            
            if (telaId === 'treinamentos-screen') {
                carregarGridTreinamentos();
            }
        }
    };
    
    // ============ OUTRAS FUNÇÕES ============
    window.removerImagem = function() {
        document.getElementById('previewContainer').style.display = 'none';
        document.getElementById('uploadArea').style.display = 'flex';
        document.getElementById('imagemTreinamento').value = '';
    };
    
    // Configurar preview da imagem
    const imagemInput = document.getElementById('imagemTreinamento');
    if (imagemInput) {
        imagemInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('previewImage').src = e.target.result;
                    document.getElementById('uploadArea').style.display = 'none';
                    document.getElementById('previewContainer').style.display = 'block';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Inicializar o sistema
    inicializarSistema();
});

// Funções globais
function mostrarTela(telaId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    
    const tela = document.getElementById(telaId);
    if (tela) {
        tela.style.display = 'block';
        window.scrollTo(0, 0);
    }
}

function editarTreinamento(treinamentoId) {
    // Implementação para editar treinamento
    console.log('Editar treinamento:', treinamentoId);
}

function excluirTreinamento(treinamentoId) {
    if (confirm('Tem certeza que deseja excluir este treinamento?')) {
        // Implementação para excluir treinamento
        console.log('Excluir treinamento:', treinamentoId);
    }
}