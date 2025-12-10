// treinamentos.js - SISTEMA COMPLETO CORRIGIDO
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de Treinamentos iniciado!');
    
    // ============ DADOS MOCK COMPLETOS ============
    const mockInstrutores = [
        { id: 1, nome: 'Marina Souza', departamento: 'RH', especialidade: 'Liderança' },
        { id: 2, nome: 'João Pereira', departamento: 'TI', especialidade: 'Desenvolvimento' },
        { id: 3, nome: 'Beatriz Lima', departamento: 'Marketing', especialidade: 'Comunicação' },
        { id: 4, nome: 'Carlos Nogueira', departamento: 'Financeiro', especialidade: 'Gestão Financeira' },
        { id: 5, nome: 'Fernanda Costa', departamento: 'RH', especialidade: 'Recrutamento' },
        { id: 6, nome: 'Ricardo Alves', departamento: 'TI', especialidade: 'Infraestrutura' }
    ];

    const mockColaboradores = [
        { 
            id: 1, 
            nome: 'Ana Silva', 
            cargo: 'Desenvolvedora Frontend', 
            departamento: 'TI',
            email: 'ana.silva@empresa.com',
            telefone: '(11) 99999-9999',
            dataAdmissao: '2022-03-15',
            presencaGeral: 85
        },
        { 
            id: 2, 
            nome: 'Pedro Santos', 
            cargo: 'Analista de Marketing', 
            departamento: 'Marketing',
            email: 'pedro.santos@empresa.com',
            telefone: '(11) 98888-8888',
            dataAdmissao: '2021-08-22',
            presencaGeral: 92
        },
        { 
            id: 3, 
            nome: 'Carla Oliveira', 
            cargo: 'Analista Financeiro', 
            departamento: 'Financeiro',
            email: 'carla.oliveira@empresa.com',
            telefone: '(11) 97777-7777',
            dataAdmissao: '2023-01-10',
            presencaGeral: 78
        },
        { 
            id: 4, 
            nome: 'Ricardo Almeida', 
            cargo: 'Recrutador', 
            departamento: 'RH',
            email: 'ricardo.almeida@empresa.com',
            telefone: '(11) 96666-6666',
            dataAdmissao: '2020-11-05',
            presencaGeral: 95
        },
        { 
            id: 5, 
            nome: 'Juliana Rocha', 
            cargo: 'Designer UX/UI', 
            departamento: 'TI',
            email: 'juliana.rocha@empresa.com',
            telefone: '(11) 95555-5555',
            dataAdmissao: '2022-06-30',
            presencaGeral: 88
        },
        { 
            id: 6, 
            nome: 'Lucas Mendes', 
            cargo: 'Gerente de Projetos', 
            departamento: 'TI',
            email: 'lucas.mendes@empresa.com',
            telefone: '(11) 94444-4444',
            dataAdmissao: '2019-09-12',
            presencaGeral: 91
        }
    ];

    // Estado da aplicação
    let treinamentos = JSON.parse(localStorage.getItem('rh_treinamentos') || '[]');
    let treinamentoAtual = null;
    let contadorModulos = 0;
    let contadorAulas = 0;

    // ============ FUNÇÕES DE NAVEGAÇÃO GLOBAIS ============
    window.mostrarTela = function(telaId) {
        console.log('🔄 Mostrando tela:', telaId);
        
        // Esconder todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        
        // Mostrar a tela solicitada
        const tela = document.getElementById(telaId);
        if (tela) {
            tela.style.display = 'block';
            window.scrollTo(0, 0);
            
            // Inicializar componentes específicos da tela
            if (telaId === 'treinamentos-screen') {
                carregarGridTreinamentos();
            } else if (telaId === 'cadastro-treinamento-screen') {
                // Já é inicializado quando abre
            } else if (telaId === 'visualizar-treinamento-screen') {
                if (treinamentoAtual) {
                    carregarDadosVisualizacao();
                }
            }
        }
    };

    // ============ INICIALIZAÇÃO ============
    function inicializar() {
        console.log('🔧 Inicializando sistema...');
        
        // Configurar eventos principais
        configurarEventosPrincipais();
        
        // Configurar upload de imagem
        configurarUploadImagem();
        
        // Preencher select de instrutores
        preencherSelectInstrutores();
        
        // Se estiver na tela de treinamentos, carregar
        if (document.getElementById('treinamentos-screen').style.display !== 'none') {
            carregarGridTreinamentos();
        }
        
        console.log('✅ Sistema pronto!');
    }

    // ============ CONFIGURAÇÃO DE EVENTOS PRINCIPAIS ============
    function configurarEventosPrincipais() {
        // Botão "Novo Treinamento" na tela principal
        const novoTreinamentoBtn = document.getElementById('novoTreinamentoBtn');
        if (novoTreinamentoBtn) {
            novoTreinamentoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('📝 Abrindo formulário novo treinamento');
                abrirCadastroNovoTreinamento();
            });
        }
        
        // Botão cancelar no formulário
        const btnCancelar = document.querySelector('.btn-cancelar');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Cancelando criação');
                if (confirm('Tem certeza que deseja cancelar? As alterações serão perdidas.')) {
                    mostrarTela('treinamentos-screen');
                }
            });
        }
        
        // Botão voltar no formulário (setinha)
        const btnVoltar = document.querySelector('.btn-voltar');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('↩️ Voltando para lista');
                if (confirm('Tem certeza que deseja voltar? As alterações serão perdidas.')) {
                    mostrarTela('treinamentos-screen');
                }
            });
        }
        
        // Formulário de cadastro
        const formCadastro = document.getElementById('cadastroTreinamentoForm');
        if (formCadastro) {
            formCadastro.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('💾 Salvando treinamento...');
                salvarTreinamento();
            });
        }
        
        // Filtros
        const buscaInput = document.getElementById('buscaTreinamento');
        if (buscaInput) {
            buscaInput.addEventListener('input', filtrarTreinamentos);
        }
    }

    // ============ UPLOAD DE IMAGEM ============
    function configurarUploadImagem() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('imagemTreinamento');
        const previewContainer = document.getElementById('previewContainer');
        const previewImage = document.getElementById('previewImage');
        
        if (!uploadArea || !fileInput) {
            console.error('❌ Elementos de upload não encontrados');
            return;
        }
        
        console.log('📸 Configurando upload de imagem...');
        
        // Clicar na área de upload
        uploadArea.addEventListener('click', function() {
            console.log('🖱️ Clicou na área de upload');
            fileInput.click();
        });
        
        // Quando selecionar arquivo
        fileInput.addEventListener('change', function(e) {
            console.log('📁 Arquivo selecionado:', e.target.files[0]?.name);
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                
                // Validar tipo
                if (!file.type.match('image.*')) {
                    alert('❌ Por favor, selecione apenas imagens!');
                    return;
                }
                
                // Validar tamanho (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('❌ A imagem deve ter no máximo 5MB!');
                    return;
                }
                
                // Fazer preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    console.log('🖼️ Preview gerado com sucesso');
                    previewImage.src = e.target.result;
                    previewContainer.style.display = 'block';
                    uploadArea.style.display = 'none';
                };
                reader.onerror = function() {
                    alert('❌ Erro ao carregar a imagem');
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#f09538';
            uploadArea.style.background = '#fffaf5';
        });
        
        uploadArea.addEventListener('dragleave', function() {
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '#f9f9f9';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '#f9f9f9';
            
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });
    }

    // ============ SELECT DE INSTRUTORES ============
    function preencherSelectInstrutores() {
        const select = document.getElementById('instrutorTreinamento');
        if (!select) {
            console.error('❌ Select de instrutores não encontrado');
            return;
        }
        
        console.log('👨‍🏫 Preenchendo select com', mockInstrutores.length, 'instrutores');
        
        // Limpar opções existentes (exceto a primeira)
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Adicionar instrutores
        mockInstrutores.forEach(instrutor => {
            const option = document.createElement('option');
            option.value = instrutor.id;
            option.textContent = `${instrutor.nome} - ${instrutor.departamento}`;
            option.title = `Especialidade: ${instrutor.especialidade}`;
            select.appendChild(option);
        });
        
        console.log('✅ Select preenchido com sucesso');
    }

    // ============ FUNÇÕES PARA MÓDULOS E AULAS ============
    window.adicionarModulo = function() {
        contadorModulos++;
        const listaModulos = document.getElementById('listaModulos');
        if (!listaModulos) return;
        
        const moduloId = `modulo-${Date.now()}-${contadorModulos}`;
        const moduloHTML = `
            <div class="modulo-item" data-modulo-id="${moduloId}">
                <div class="modulo-header">
                    <button type="button" class="btn-remover-modulo" onclick="removerModulo(this)" ><i class="fa-solid fa-xmark"></i> Remover
                    </button>

                <div class="inputs-label">
                    <input type="text" class="modulo-titulo" placeholder="Título do módulo"
                           value="Módulo ${contadorModulos}" required>
                </div>
                    
                </div>
                
                <div class="modulo-descricao">
                <div class="inputs-label">
                    <textarea class="modulo-descricao-texto" placeholder="Descrição do módulo (opcional)" 
                              rows="4"></textarea>
                </div>
                    
                </div>
                
                <div class="aulas-container">
                    <h3>Aulas deste módulo:</h3>
                    <div class="lista-aulas" data-modulo-id="${moduloId}">
                        <!-- Aulas serão adicionadas aqui -->
                    </div>
                    <button type="button" class="btn-defaunt" onclick="adicionarAula('${moduloId}')">
                        <i class="fas fa-plus"></i> Adicionar Aula
                    </button>
                </div>
            </div>
        `;
        
        listaModulos.insertAdjacentHTML('beforeend', moduloHTML);
        console.log(`📦 Módulo ${contadorModulos} adicionado`);
    };

    window.adicionarAula = function(moduloId) {
        contadorAulas++;
        const listaAulas = document.querySelector(`[data-modulo-id="${moduloId}"] .lista-aulas`);
        if (!listaAulas) return;
        
        const aulaId = `aula-${Date.now()}-${contadorAulas}`;
        const aulaHTML = `
            <div class="aula-item" data-aula-id="${aulaId}">
                <div class="aula-header">
                    <button type="button" class="btn-remover-aula" onclick="removerAula(this)">
                        <i class="fas fa-times"></i>Remover
                    </button>
                <div class="inputs-label">
                 <label>Título Aula:</label>   
                 <input type="text" class="aula-titulo" placeholder="Título da aula" 
                           value="Aula ${contadorAulas}" required>
                </div>
                    
                </div>
                
                <div class="aula-conteudo">
                    <div class="aula-descricao inputs-label">
                        <label>Descrição da Aula</label>
                        <textarea class="aula-descricao-texto" placeholder="Descrição da aula (opcional)" 
                                  rows="2"></textarea>
                    </div>
                    
                    <div class="aula-tipo inputs-label">
                        <label>Tipo de material:</label>
                        <select class="tipo-material-select" onchange="atualizarCamposMaterial(this, '${aulaId}')">
                            <option value="texto">Texto</option>
                            <option value="video">Vídeo</option>
                            <option value="pdf">PDF/Documento</option>
                            <option value="link">Link Externo</option>
                            <option value="forms">Google Forms</option>
                        </select>
                    </div>
                    
                    <div class="campos-material" id="campos-${aulaId}" data-tipo="texto">
                        <div class="campo-material inputs-label">
                            <label>Conteúdo textual:</label>
                            <textarea class="material-texto" placeholder="Digite o conteúdo aqui..." 
                                      rows="4"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        listaAulas.insertAdjacentHTML('beforeend', aulaHTML);
        console.log(`📝 Aula ${contadorAulas} adicionada ao módulo ${moduloId}`);
    };

    window.atualizarCamposMaterial = function(select, aulaId) {
        const tipo = select.value;
        const camposDiv = document.getElementById(`campos-${aulaId}`);
        
        if (!camposDiv) return;
        
        camposDiv.dataset.tipo = tipo;
        
        let camposHTML = '';
        switch(tipo) {
            case 'video':
                camposHTML = `
                    <div class="campo-material inputs-label">
                        <label>Vídeo:</label>
                        <input type="file" class="material-url" placeholder="https://youtube.com/watch?v=...">
                        <input type="url" class="material-url" placeholder="https://treinamento.com.br">
                    </div>
                `;
                break;
            case 'pdf':
                camposHTML = `
                    <div class="campo-material inputs-label">
                        <label>Arquivo PDF:</label>
                        <input type="file" class="material-file" accept=".pdf">
                    </div>
                `;
                break;
            case 'link':
                camposHTML = `
                    <div class="campo-material inputs-label">
                        <label>URL do link:</label>
                        <input type="url" class="material-url" placeholder="https://exemplo.com">
                    </div>
                `;
                break;
            case 'forms':
                camposHTML = `
                    <div class="campo-material inputs-label">
                        <label>URL do Google Forms:</label>
                        <input type="url" class="material-url" placeholder="https://forms.google.com/...">
                    </div>
                `;
                break;
            default: // texto
                camposHTML = `
                    <div class="campo-material inputs-label">
                        <label>Conteúdo textual:</label>
                        <textarea class="material-texto" placeholder="Digite o conteúdo aqui..." 
                                  rows="4"></textarea>
                    </div>
                `;
        }
        
        camposDiv.innerHTML = camposHTML;
    };

    window.removerModulo = function(botao) {
        if (confirm('Tem certeza que deseja remover este módulo e todas as suas aulas?')) {
            const moduloItem = botao.closest('.modulo-item');
            moduloItem.remove();
            console.log('🗑️ Módulo removido');
        }
    };

    window.removerAula = function(botao) {
        if (confirm('Tem certeza que deseja remover esta aula?')) {
            const aulaItem = botao.closest('.aula-item');
            aulaItem.remove();
            console.log('🗑️ Aula removida');
        }
    };

    window.removerImagem = function() {
        const previewContainer = document.getElementById('previewContainer');
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('imagemTreinamento');
        
        if (previewContainer && uploadArea && fileInput) {
            previewContainer.style.display = 'none';
            uploadArea.style.display = 'flex';
            fileInput.value = '';
            console.log('🗑️ Imagem removida');
        }
    };

    // ============ SALVAR TREINAMENTO ============
    async function salvarTreinamento() {
        console.log('💾 Salvando treinamento...');
        
        // Validar campos obrigatórios
        const titulo = document.getElementById('tituloTreinamento').value.trim();
        const cargaHoraria = document.getElementById('cargaHoraria').value;
        const instrutorId = document.getElementById('instrutorTreinamento').value;
        const descricao = document.getElementById('descricaoTreinamento').value.trim();
        
        if (!titulo || !cargaHoraria || !instrutorId || !descricao) {
            alert('❌ Preencha todos os campos obrigatórios!');
            return;
        }
        
        // Processar imagem
        let capaBase64 = null;
        const imagemFile = document.getElementById('imagemTreinamento').files[0];
        if (imagemFile) {
            try {
                capaBase64 = await converterParaBase64(imagemFile);
                console.log('🖼️ Imagem convertida para base64');
            } catch (error) {
                console.error('❌ Erro ao converter imagem:', error);
                alert('❌ Erro ao processar a imagem. Tente novamente.');
                return;
            }
        }
        
        // Coletar módulos e aulas
        const modulos = [];
        document.querySelectorAll('.modulo-item').forEach(moduloDiv => {
            const modulo = {
                id: moduloDiv.dataset.moduloId,
                titulo: moduloDiv.querySelector('.modulo-titulo').value,
                descricao: moduloDiv.querySelector('.modulo-descricao-texto').value,
                aulas: []
            };
            
            // Coletar aulas
            moduloDiv.querySelectorAll('.aula-item').forEach(aulaDiv => {
                const aula = {
                    id: aulaDiv.dataset.aulaId,
                    titulo: aulaDiv.querySelector('.aula-titulo').value,
                    descricao: aulaDiv.querySelector('.aula-descricao-texto').value,
                    tipo: aulaDiv.querySelector('.tipo-material-select').value
                };
                
                // Coletar conteúdo baseado no tipo
                const camposMaterial = aulaDiv.querySelector('.campos-material');
                switch(aula.tipo) {
                    case 'texto':
                        aula.conteudo = camposMaterial.querySelector('.material-texto')?.value || '';
                        break;
                    case 'video':
                    case 'link':
                    case 'forms':
                        aula.url = camposMaterial.querySelector('.material-url')?.value || '';
                        break;
                    case 'pdf':
                        // Em um sistema real, aqui você faria upload do arquivo
                        aula.arquivo = 'documento.pdf';
                        break;
                }
                
                modulo.aulas.push(aula);
            });
            
            modulos.push(modulo);
        });
        
        // Validar se tem pelo menos uma aula
        const totalAulas = modulos.reduce((total, modulo) => total + modulo.aulas.length, 0);
        if (totalAulas === 0) {
            alert('❌ Adicione pelo menos uma aula ao treinamento!');
            return;
        }
        
        // Encontrar instrutor
        const instrutor = mockInstrutores.find(i => i.id == instrutorId);
        
        // Criar objeto do treinamento
        const treinamento = {
            id: 'T' + Date.now().toString(),
            titulo: titulo,
            cargaHoraria: parseInt(cargaHoraria),
            instrutorId: instrutorId,
            instrutorNome: instrutor ? `${instrutor.nome} (${instrutor.departamento})` : 'Não definido',
            categoria: document.getElementById('categoriaTreinamento').value,
            descricao: descricao,
            capa: capaBase64,
            modulos: modulos,
            colaboradoresAtribuidos: [], // Começa vazio
            presencas: [], // Registro de presenças
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString(),
            status: 'ativo'
        };
        
        console.log('📄 Treinamento criado:', treinamento);
        
        // Salvar no array
        treinamentos.push(treinamento);
        
        // Salvar no localStorage
        localStorage.setItem('rh_treinamentos', JSON.stringify(treinamentos));
        
        // Feedback e navegação
        alert('✅ Treinamento salvo com sucesso!');
        mostrarTela('treinamentos-screen');
        carregarGridTreinamentos();
    }

    function converterParaBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // ============ GRID DE TREINAMENTOS ============
    function carregarGridTreinamentos() {
        const grid = document.getElementById('treinamentos_grid');
        if (!grid) return;
        
        if (treinamentos.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: #666;">
                    <i class="fas fa-graduation-cap" style="font-size: 4rem; margin-bottom: 1.5rem; color: #ddd;"></i>
                    <h3 style="margin: 0 0 0.5rem 0;">Nenhum treinamento cadastrado</h3>
                    <p style="margin: 0 0 1.5rem 0;">Clique em "Novo Treinamento" para começar</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        treinamentos.forEach(treinamento => {
            const totalAulas = treinamento.modulos ? 
                treinamento.modulos.reduce((total, modulo) => total + (modulo.aulas ? modulo.aulas.length : 0), 0) : 0;
            
            const totalColaboradores = treinamento.colaboradoresAtribuidos ? treinamento.colaboradoresAtribuidos.length : 0;
            
            html += `
                <div class="card_treinamento">
                    <div class="capa_treinamento" style="height: 200px; background: linear-gradient(135deg, #f09538, #edab62); display: flex; align-items: center; justify-content: center; position: relative;">
                        ${treinamento.capa ? 
                            `<img src="${treinamento.capa}" alt="${treinamento.titulo}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                            `<i class="fas fa-graduation-cap" style="font-size: 4rem; color: white;"></i>`
                        }
                        <span style="position: absolute; top: 10px; right: 10px; background: #4CAF50; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${treinamento.status || 'Ativo'}</span>
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
                                <i class="fas fa-users"></i>
                                <span>${totalColaboradores} alunos</span>
                            </div>
                        </div>
                        
                        <div class="card-acoes" >
                            <button class="btn-visualizar" onclick="visualizarTreinamento('${treinamento.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-editar" onclick="editarTreinamento('${treinamento.id}')" >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-excluir" onclick="excluirTreinamento('${treinamento.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML = html;
    }

    // ============ FUNÇÕES GLOBAIS ============
    window.abrirCadastroNovoTreinamento = function() {
        // Limpar formulário
        document.getElementById('cadastroTreinamentoForm').reset();
        document.getElementById('listaModulos').innerHTML = '';
        document.getElementById('previewContainer').style.display = 'none';
        document.getElementById('uploadArea').style.display = 'flex';
        document.getElementById('tituloForm').textContent = 'Novo Treinamento';
        document.getElementById('treinamentoId').value = '';
        
        // Resetar contadores
        contadorModulos = 0;
        contadorAulas = 0;
        
        // Adicionar primeiro módulo
        adicionarModulo();
        
        // Mostrar tela
        mostrarTela('cadastro-treinamento-screen');
    };

    window.visualizarTreinamento = function(treinamentoId) {
        treinamentoAtual = treinamentos.find(t => t.id === treinamentoId);
        if (!treinamentoAtual) {
            alert('❌ Treinamento não encontrado!');
            return;
        }
        
        // Mostrar tela de visualização
        mostrarTela('visualizar-treinamento-screen');
        
        // Carregar dados (será feito no mostrarTela)
    };

    window.editarTreinamento = function(treinamentoId) {
        treinamentoAtual = treinamentos.find(t => t.id === treinamentoId);
        if (!treinamentoAtual) {
            alert('❌ Treinamento não encontrado!');
            return;
        }
        
        console.log('✏️ Editando treinamento:', treinamentoAtual.titulo);
        
        // Preencher formulário com dados existentes
        document.getElementById('tituloForm').textContent = 'Editar Treinamento';
        document.getElementById('treinamentoId').value = treinamentoAtual.id;
        document.getElementById('tituloTreinamento').value = treinamentoAtual.titulo;
        document.getElementById('cargaHoraria').value = treinamentoAtual.cargaHoraria;
        document.getElementById('instrutorTreinamento').value = treinamentoAtual.instrutorId;
        document.getElementById('categoriaTreinamento').value = treinamentoAtual.categoria || '';
        document.getElementById('descricaoTreinamento').value = treinamentoAtual.descricao;
        
        // Preview da imagem
        if (treinamentoAtual.capa) {
            const previewContainer = document.getElementById('previewContainer');
            const previewImage = document.getElementById('previewImage');
            const uploadArea = document.getElementById('uploadArea');
            
            if (previewContainer && previewImage && uploadArea) {
                previewImage.src = treinamentoAtual.capa;
                previewContainer.style.display = 'block';
                uploadArea.style.display = 'none';
            }
        }
        
        // Limpar módulos existentes
        document.getElementById('listaModulos').innerHTML = '';
        
        // Recriar módulos e aulas
        contadorModulos = 0;
        contadorAulas = 0;
        
        if (treinamentoAtual.modulos && treinamentoAtual.modulos.length > 0) {
            treinamentoAtual.modulos.forEach(modulo => {
                contadorModulos++;
                const moduloId = modulo.id || `modulo-${Date.now()}-${contadorModulos}`;
                
                const moduloHTML = `
                    <div class="modulo-item" data-modulo-id="${moduloId}">
                        <div class="modulo-header">
                            <button type="button" class="btn-remover-modulo" onclick="removerModulo(this)" ><i class="fa-solid fa-xmark"></i> Remover
                            </button>

                        <div class="inputs-label">
                            <input type="text" class="modulo-titulo" placeholder="Título do módulo"
                                   value="${modulo.titulo}" required>
                        </div>
                            
                        </div>
                        
                        <div class="modulo-descricao">
                        <div class="inputs-label">
                            <textarea class="modulo-descricao-texto" placeholder="Descrição do módulo (opcional)" 
                                      rows="4">${modulo.descricao || ''}</textarea>
                        </div>
                            
                        </div>
                        
                        <div class="aulas-container">
                            <h3>Aulas deste módulo:</h3>
                            <div class="lista-aulas" data-modulo-id="${moduloId}">
                                <!-- Aulas serão adicionadas aqui -->
                            </div>
                            <button type="button" class="btn-defaunt" onclick="adicionarAula('${moduloId}')">
                                <i class="fas fa-plus"></i> Adicionar Aula
                            </button>
                        </div>
                    </div>
                `;
                
                document.getElementById('listaModulos').insertAdjacentHTML('beforeend', moduloHTML);
                
                // Adicionar aulas deste módulo
                if (modulo.aulas && modulo.aulas.length > 0) {
                    modulo.aulas.forEach(aula => {
                        adicionarAulaParaEdicao(moduloId, aula);
                    });
                }
            });
        } else {
            // Se não tiver módulos, adicionar um vazio
            adicionarModulo();
        }
        
        // Mostrar tela de edição
        mostrarTela('cadastro-treinamento-screen');
    };

    function adicionarAulaParaEdicao(moduloId, aulaData) {
        contadorAulas++;
        const listaAulas = document.querySelector(`[data-modulo-id="${moduloId}"] .lista-aulas`);
        if (!listaAulas) return;
        
        const aulaId = aulaData.id || `aula-${Date.now()}-${contadorAulas}`;
        const aulaHTML = `
            <div class="aula-item" data-aula-id="${aulaId}">
                <div class="aula-header">
                    <button type="button" class="btn-remover-aula" onclick="removerAula(this)">
                        <i class="fas fa-times"></i>Remover
                    </button>
                <div class="inputs-label">
                 <label>Título Aula:</label>   
                 <input type="text" class="aula-titulo" placeholder="Título da aula" 
                           value="${aulaData.titulo}" required>
                </div>
                    
                </div>
                
                <div class="aula-conteudo">
                    <div class="aula-descricao inputs-label">
                        <label>Descrição da Aula</label>
                        <textarea class="aula-descricao-texto" placeholder="Descrição da aula (opcional)" 
                                  rows="2">${aulaData.descricao || ''}</textarea>
                    </div>
                    
                    <div class="aula-tipo inputs-label">
                        <label>Tipo de material:</label>
                        <select class="tipo-material-select" onchange="atualizarCamposMaterial(this, '${aulaId}')">
                            <option value="texto" ${aulaData.tipo === 'texto' ? 'selected' : ''}>Texto</option>
                            <option value="video" ${aulaData.tipo === 'video' ? 'selected' : ''}>Vídeo</option>
                            <option value="pdf" ${aulaData.tipo === 'pdf' ? 'selected' : ''}>PDF/Documento</option>
                            <option value="link" ${aulaData.tipo === 'link' ? 'selected' : ''}>Link Externo</option>
                            <option value="forms" ${aulaData.tipo === 'forms' ? 'selected' : ''}>Google Forms</option>
                        </select>
                    </div>
                    
                    <div class="campos-material" id="campos-${aulaId}" data-tipo="${aulaData.tipo || 'texto'}">
                        ${gerarCamposMaterialParaEdicao(aulaData)}
                    </div>
                </div>
            </div>
        `;
        
        listaAulas.insertAdjacentHTML('beforeend', aulaHTML);
    }

    function gerarCamposMaterialParaEdicao(aulaData) {
        const tipo = aulaData.tipo || 'texto';
        
        switch(tipo) {
            case 'video':
                return `
                    <div class="campo-material inputs-label">
                        <label>Vídeo:</label>
                        <input type="file" class="material-url" placeholder="https://youtube.com/watch?v=...">
                        <input type="url" class="material-url" placeholder="https://treinamento.com.br" value="${aulaData.url || ''}">
                    </div>
                `;
            case 'pdf':
                return `
                    <div class="campo-material inputs-label">
                        <label>Arquivo PDF:</label>
                        <input type="file" class="material-file" accept=".pdf">
                        ${aulaData.arquivo ? `<p style="margin-top: 0.5rem; color: #666;">Arquivo atual: ${aulaData.arquivo}</p>` : ''}
                    </div>
                `;
            case 'link':
                return `
                    <div class="campo-material inputs-label">
                        <label>URL do link:</label>
                        <input type="url" class="material-url" placeholder="https://exemplo.com" value="${aulaData.url || ''}">
                    </div>
                `;
            case 'forms':
                return `
                    <div class="campo-material inputs-label">
                        <label>URL do Google Forms:</label>
                        <input type="url" class="material-url" placeholder="https://forms.google.com/..." value="${aulaData.url || ''}">
                    </div>
                `;
            default: // texto
                return `
                    <div class="campo-material inputs-label">
                        <label>Conteúdo textual:</label>
                        <textarea class="material-texto" placeholder="Digite o conteúdo aqui..." 
                                  rows="4">${aulaData.conteudo || ''}</textarea>
                    </div>
                `;
        }
    }

    window.excluirTreinamento = function(treinamentoId) {
        if (confirm('Tem certeza que deseja excluir este treinamento?')) {
            treinamentos = treinamentos.filter(t => t.id !== treinamentoId);
            localStorage.setItem('rh_treinamentos', JSON.stringify(treinamentos));
            carregarGridTreinamentos();
            alert('✅ Treinamento excluído com sucesso!');
        }
    };

    // ============ TELA DE VISUALIZAÇÃO ============
    function carregarDadosVisualizacao() {
        if (!treinamentoAtual) return;
        
        // Informações básicas
        document.getElementById('descricaoTreinamentoVisualizar').textContent = treinamentoAtual.descricao;
        
        // Calcular totais
        const totalAulas = calcularTotalAulas();
        const totalAlunos = treinamentoAtual.colaboradoresAtribuidos?.length || 0;
        
        document.getElementById('totalMateriaisVisualizar').textContent = totalAulas;
        document.getElementById('totalAlunosVisualizar').textContent = totalAlunos;
        
        // Carregar módulos
        carregarModulosVisualizacao();
        
        // Carregar colaboradores
        carregarColaboradoresVisualizacao();
        
        // Configurar filtros
        configurarFiltroAulasPresenca();
    }

    function carregarModulosVisualizacao() {
        const container = document.getElementById('listaModulosVisualizar');
        if (!container || !treinamentoAtual.modulos) {
            container.innerHTML = '<p>Nenhum módulo disponível.</p>';
            return;
        }
        
        let html = '';
        treinamentoAtual.modulos.forEach((modulo, moduloIndex) => {
            const totalAulasModulo = modulo.aulas?.length || 0;
            
            html += `
                <div class="modulo-visualizacao">
                    <div class="modulo-header-visualizacao" onclick="toggleModulo(this)">
                        <h4>
                            <i class="fas fa-folder"></i>
                            Módulo ${moduloIndex + 1}: ${modulo.titulo}
                            <span class="modulo-contador">${totalAulasModulo} aulas</span>
                        </h4>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    
                    ${modulo.descricao ? `
                        <div class="modulo-descricao-visualizacao">
                            <p>${modulo.descricao}</p>
                        </div>
                    ` : ''}
                    
                    <div class="aulas-container-visualizacao">
                        ${carregarAulasModulo(modulo, moduloIndex)}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p>Nenhum módulo disponível.</p>';
    }

    function carregarAulasModulo(modulo, moduloIndex) {
        if (!modulo.aulas || modulo.aulas.length === 0) {
            return '<p class="sem-aulas">Nenhuma aula neste módulo.</p>';
        }
        
        let html = '';
        modulo.aulas.forEach((aula, aulaIndex) => {
            html += `
                <div class="aula-visualizacao" data-aula-id="${aula.id}">
                    <div class="aula-header-visualizacao">
                        <h5>
                            <i class="fas fa-play-circle"></i>
                            Aula ${moduloIndex + 1}.${aulaIndex + 1}: ${aula.titulo}
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
                        ${gerarConteudoAula(aula)}
                    </div>
                    
                    <div class="progresso-aula-alunos">
                        <h6>Progresso dos Alunos:</h6>
                        <div class="lista-alunos-aula" id="progresso-aula-${aula.id}">
                            ${gerarProgressoAlunosAula(aula.id)}
                        </div>
                    </div>
                </div>
            `;
        });
        
        return html;
    }

    function gerarConteudoAula(aula) {
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

    function gerarProgressoAlunosAula(aulaId) {
        if (!treinamentoAtual.colaboradoresAtribuidos || treinamentoAtual.colaboradoresAtribuidos.length === 0) {
            return '<p class="sem-alunos">Nenhum aluno atribuído.</p>';
        }
        
        let html = '';
        treinamentoAtual.colaboradoresAtribuidos.forEach(colaborador => {
            const colaboradorCompleto = mockColaboradores.find(c => c.id === colaborador.id) || colaborador;
            
            // Para simular progresso, usamos dados aleatórios
            const progresso = colaborador.progresso || Math.floor(Math.random() * 100);
            
            let status, statusClass;
            if (progresso === 0) {
                status = 'Não Iniciado';
                statusClass = 'status-nao-iniciado';
            } else if (progresso < 100) {
                status = 'Em Andamento';
                statusClass = 'status-andamento';
            } else {
                status = 'Concluído';
                statusClass = 'status-concluido';
            }
            
            html += `
                <div class="aluno-aula-item">
                    <div class="aluno-info">
                        <i class="fas fa-user-circle"></i>
                        <div>
                            <div class="aluno-nome">${colaboradorCompleto.nome}</div>
                            <div class="aluno-departamento">${colaboradorCompleto.departamento}</div>
                        </div>
                    </div>
                    <div class="aluno-status">
                        <div class="barra-progresso">
                            <div class="barra-progresso-fill" style="width: ${progresso}%"></div>
                            <div class="barra-progresso-texto">${progresso}%</div>
                        </div>
                        <span class="status-badge ${statusClass}">${status}</span>
                    </div>
                </div>
            `;
        });
        
        return html;
    }

    window.toggleModulo = function(element) {
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

    // ============ FUNÇÕES PARA ATRIBUIR COLABORADORES ============
    window.mostrarModalAtribuirColaboradores = function() {
        const modal = document.getElementById('modalAtribuirColaboradores');
        modal.style.display = 'flex';
        carregarColaboradoresDisponiveis();
    };

    window.fecharModalAtribuir = function() {
        const modal = document.getElementById('modalAtribuirColaboradores');
        modal.style.display = 'none';
    };

    function carregarColaboradoresDisponiveis() {
        const container = document.getElementById('listaColaboradoresModal');
        const colaboradoresAtribuidosIds = treinamentoAtual.colaboradoresAtribuidos?.map(c => c.id) || [];
        
        // Filtrar colaboradores já atribuídos
        const colaboradoresDisponiveis = mockColaboradores.filter(colab => 
            !colaboradoresAtribuidosIds.includes(colab.id)
        );
        
        // Ordenar por data de admissão (mais recente primeiro)
        colaboradoresDisponiveis.sort((a, b) => 
            new Date(b.dataAdmissao) - new Date(a.dataAdmissao)
        );
        
        if (colaboradoresDisponiveis.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666; grid-column: 1 / -1;">
                    <i class="fas fa-users-slash" style="font-size: 3rem; margin-bottom: 1rem; color: #ddd;"></i>
                    <h4 style="margin: 0 0 0.5rem 0;">Todos os colaboradores já estão atribuídos</h4>
                    <p style="margin: 0;">Não há colaboradores disponíveis para atribuição</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        colaboradoresDisponiveis.forEach(colab => {
            const dataAdmissao = new Date(colab.dataAdmissao);
            const hoje = new Date();
            const mesesContratacao = Math.floor((hoje - dataAdmissao) / (1000 * 60 * 60 * 24 * 30));
            
            html += `
                <div class="colaborador-item-modal" data-colab-id="${colab.id}">
                    <input type="checkbox" class="colaborador-checkbox" value="${colab.id}" 
                           onchange="toggleColaboradorSelecionado(this)">
                    <div class="colaborador-info-modal">
                        <h4>${colab.nome}</h4>
                        <p><strong>Cargo:</strong> ${colab.cargo}</p>
                        <p><strong>Departamento:</strong> ${colab.departamento}</p>
                        <p class="colaborador-data">
                            <strong>Contratado:</strong> ${formatarData(dataAdmissao)} 
                            (${mesesContratacao} meses)
                        </p>
                    </div>
                    <i class="fas fa-user-circle" style="font-size: 2rem; color: #666;"></i>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Configurar eventos de filtro
        configurarFiltrosModal();
    }

    function configurarFiltrosModal() {
        const filtroDepartamento = document.getElementById('filtroModalDepartamento');
        const filtroContratacao = document.getElementById('filtroModalContratacao');
        const filtroMes = document.getElementById('filtroModalMes');
        const buscaInput = document.getElementById('buscaColaborador');
        
        if (!filtroDepartamento || !filtroContratacao || !filtroMes || !buscaInput) return;
        
        const aplicarFiltros = () => {
            const departamento = filtroDepartamento.value;
            const contratacao = filtroContratacao.value;
            const mes = filtroMes.value;
            const busca = buscaInput.value.toLowerCase();
            
            document.querySelectorAll('.colaborador-item-modal').forEach(item => {
                const nome = item.querySelector('h4').textContent.toLowerCase();
                const dept = item.querySelector('p:nth-child(2)').textContent.toLowerCase();
                const dataText = item.querySelector('.colaborador-data').textContent;
                
                let mostrar = true;
                
                // Filtro por busca
                if (busca && !nome.includes(busca)) {
                    mostrar = false;
                }
                
                // Filtro por departamento
                if (departamento && !dept.includes(departamento.toLowerCase())) {
                    mostrar = false;
                }
                
                // Filtro por mês de contratação
                if (mes) {
                    const mesContratacao = dataText.match(/\d{2}\/\d{4}/)?.[0];
                    if (mesContratacao) {
                        const mesNum = mesContratacao.split('/')[0];
                        if (parseInt(mesNum) !== parseInt(mes)) {
                            mostrar = false;
                        }
                    }
                }
                
                // Filtro por tempo de contratação
                if (contratacao === 'recente') {
                    // Já ordenado por mais recente
                } else if (contratacao === 'antigo') {
                    // Reverter ordem (seria melhor reordenar o array)
                } else if (contratacao === 'ultimo-mes') {
                    const meses = parseInt(dataText.match(/\((\d+)/)?.[1] || '0');
                    if (meses > 1) {
                        mostrar = false;
                    }
                } else if (contratacao === 'ultimos-3-meses') {
                    const meses = parseInt(dataText.match(/\((\d+)/)?.[1] || '0');
                    if (meses > 3) {
                        mostrar = false;
                    }
                }
                
                item.style.display = mostrar ? 'flex' : 'none';
            });
        };
        
        filtroDepartamento.addEventListener('change', aplicarFiltros);
        filtroContratacao.addEventListener('change', aplicarFiltros);
        filtroMes.addEventListener('change', aplicarFiltros);
        buscaInput.addEventListener('input', aplicarFiltros);
    }

    window.toggleColaboradorSelecionado = function(checkbox) {
        const item = checkbox.closest('.colaborador-item-modal');
        const colabId = checkbox.value;
        
        if (checkbox.checked) {
            item.classList.add('selecionado');
            adicionarSelecionado(colabId);
        } else {
            item.classList.remove('selecionado');
            removerSelecionado(colabId);
        }
        
        atualizarContadorSelecionados();
    };

    function adicionarSelecionado(colabId) {
        const colaborador = mockColaboradores.find(c => c.id == colabId);
        if (!colaborador) return;
        
        const lista = document.getElementById('listaSelecionadosModal');
        const tagId = `selecionado-${colabId}`;
        
        if (!document.getElementById(tagId)) {
            const tag = document.createElement('div');
            tag.id = tagId;
            tag.className = 'selecionado-tag';
            tag.innerHTML = `
                ${colaborador.nome}
                <i class="fas fa-times" onclick="removerSelecionadoPorTag(${colabId})"></i>
            `;
            lista.appendChild(tag);
        }
    }

    function removerSelecionado(colabId) {
        const tag = document.getElementById(`selecionado-${colabId}`);
        if (tag) {
            tag.remove();
        }
        
        const checkbox = document.querySelector(`.colaborador-checkbox[value="${colabId}"]`);
        if (checkbox) {
            checkbox.checked = false;
            checkbox.closest('.colaborador-item-modal').classList.remove('selecionado');
        }
    }

    window.removerSelecionadoPorTag = function(colabId) {
        removerSelecionado(colabId);
        atualizarContadorSelecionados();
    };

    function atualizarContadorSelecionados() {
        const contador = document.querySelectorAll('.selecionado-tag').length;
        const contadorElement = document.getElementById('contadorSelecionados');
        if (contadorElement) {
            contadorElement.textContent = contador;
        }
    }

    window.atribuirColaboradoresSelecionados = function() {
        const checkboxes = document.querySelectorAll('.colaborador-checkbox:checked');
        
        if (checkboxes.length === 0) {
            alert('Selecione pelo menos um colaborador!');
            return;
        }
        
        checkboxes.forEach(checkbox => {
            const colabId = parseInt(checkbox.value);
            const colaborador = mockColaboradores.find(c => c.id === colabId);
            
            if (colaborador && !treinamentoAtual.colaboradoresAtribuidos?.some(c => c.id === colabId)) {
                if (!treinamentoAtual.colaboradoresAtribuidos) {
                    treinamentoAtual.colaboradoresAtribuidos = [];
                }
                
                treinamentoAtual.colaboradoresAtribuidos.push({
                    id: colabId,
                    nome: colaborador.nome,
                    cargo: colaborador.cargo,
                    departamento: colaborador.departamento,
                    progresso: 0,
                    concluido: false,
                    dataAtribuicao: new Date().toISOString(),
                    presencas: {} // Para registrar presença por aula
                });
            }
        });
        
        // Atualizar no localStorage
        const index = treinamentos.findIndex(t => t.id === treinamentoAtual.id);
        if (index !== -1) {
            treinamentos[index] = treinamentoAtual;
            localStorage.setItem('rh_treinamentos', JSON.stringify(treinamentos));
        }
        
        // Fechar modal e atualizar visualização
        fecharModalAtribuir();
        carregarColaboradoresVisualizacao();
        
        alert(`✅ ${checkboxes.length} colaboradores atribuídos com sucesso!`);
    };

    // ============ FUNÇÕES PARA ABA DE COLABORADORES ============
    function carregarColaboradoresVisualizacao() {
        const container = document.getElementById('listaColaboradoresTreinamento');
        if (!container) return;
        
        const colaboradores = treinamentoAtual.colaboradoresAtribuidos || [];
        
        if (colaboradores.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-users-slash" style="font-size: 3rem; margin-bottom: 1rem; color: #ddd;"></i>
                    <h4 style="margin: 0 0 0.5rem 0;">Nenhum colaborador atribuído</h4>
                    <p style="margin: 0;">Clique em "Adicionar Colaboradores" para convidar pessoas</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #f09538;">Colaborador</th>
                            <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #f09538;">Cargo</th>
                            <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #f09538;">Progresso</th>
                            <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #f09538;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        colaboradores.forEach(colab => {
            const colaboradorCompleto = mockColaboradores.find(c => c.id === colab.id) || colab;
            const progresso = colab.progresso || 0;
            const status = progresso === 100 ? 'Concluído' : progresso > 0 ? 'Em andamento' : 'Não iniciado';
            const statusClass = status === 'Concluído' ? '#4CAF50' : 
                               status === 'Em andamento' ? '#2196F3' : '#666';
            
            html += `
                <tr>
                    <td style="padding: 1rem; border-bottom: 1px solid #eee;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-user-circle" style="font-size: 1.5rem; color: #666;"></i>
                            <div>
                                <div style="font-weight: 600;">${colaboradorCompleto.nome}</div>
                                <div style="font-size: 0.9rem; color: #666;">${colaboradorCompleto.departamento}</div>
                            </div>
                        </div>
                    </td>
                    <td style="padding: 1rem; border-bottom: 1px solid #eee;">${colaboradorCompleto.cargo}</td>
                    <td style="padding: 1rem; border-bottom: 1px solid #eee;">
                        <div style="width: 100px; height: 20px; background: #eee; border-radius: 10px; overflow: hidden; position: relative;">
                            <div style="width: ${progresso}%; height: 100%; background: ${statusClass}; transition: width 0.3s;"></div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.8rem; font-weight: 600;">${progresso}%</div>
                        </div>
                    </td>
                    <td style="padding: 1rem; border-bottom: 1px solid #eee;">
                        <span style="background: ${statusClass}; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${status}</span>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }

    // ============ FUNÇÕES PARA ABA DE PRESENÇA ============
    function configurarFiltroAulasPresenca() {
        const select = document.getElementById('filtroAulaPresenca');
        if (!select) return;
        
        select.innerHTML = '<option value="">Todas as Aulas</option>';
        
        if (treinamentoAtual.modulos) {
            treinamentoAtual.modulos.forEach((modulo, moduloIndex) => {
                if (modulo.aulas) {
                    modulo.aulas.forEach((aula, aulaIndex) => {
                        const option = document.createElement('option');
                        option.value = aula.id;
                        option.textContent = `${moduloIndex + 1}.${aulaIndex + 1}. ${aula.titulo}`;
                        select.appendChild(option);
                    });
                }
            });
        }
    }

    window.mudarAba = function(abaId) {
        // Esconder todas as abas
        document.querySelectorAll('.aba-conteudo-treinamento').forEach(aba => {
            aba.style.display = 'none';
        });
        
        // Remover active de todos os botões
        document.querySelectorAll('.aba-treinamento').forEach(botao => {
            botao.classList.remove('active');
        });
        
        // Mostrar aba selecionada
        const aba = document.getElementById(`aba-${abaId}`);
        const botao = document.querySelector(`[data-aba="${abaId}"]`);
        
        if (aba) {
            aba.style.display = 'block';
            // Se for aba de colaboradores, carregar dados
            if (abaId === 'colaboradores') {
                carregarColaboradoresVisualizacao();
            }
            // Se for aba de presença, carregar tabela
            if (abaId === 'presenca') {
                carregarTabelaPresenca();
            }
        }
        if (botao) botao.classList.add('active');
    };

    function carregarTabelaPresenca() {
        const container = document.getElementById('tabelaPresencaContainer');
        if (!container || !treinamentoAtual) return;
        
        const colaboradores = treinamentoAtual.colaboradoresAtribuidos || [];
        
        if (colaboradores.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-clipboard-list" style="font-size: 3rem; margin-bottom: 1rem; color: #ddd;"></i>
                    <h4 style="margin: 0 0 0.5rem 0;">Nenhum colaborador para controle de presença</h4>
                    <p style="margin: 0;">Adicione colaboradores ao treinamento primeiro</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #f09538;">Colaborador</th>
        `;
        
        // Cabeçalhos das aulas
        let totalAulas = 0;
        if (treinamentoAtual.modulos) {
            treinamentoAtual.modulos.forEach((modulo, i) => {
                if (modulo.aulas) {
                    modulo.aulas.forEach((aula, j) => {
                        totalAulas++;
                        html += `<th style="padding: 1rem; text-align: center; border-bottom: 2px solid #f09538;" title="${aula.titulo}">${i+1}.${j+1}</th>`;
                    });
                }
            });
        }
        
        html += `
                            <th style="padding: 1rem; text-align: center; border-bottom: 2px solid #f09538;">Total</th>
                            <th style="padding: 1rem; text-align: center; border-bottom: 2px solid #f09538;">%</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Linhas dos colaboradores
        colaboradores.forEach(colab => {
            const colaboradorCompleto = mockColaboradores.find(c => c.id === colab.id) || colab;
            
            html += `
                <tr>
                    <td style="padding: 1rem; border-bottom: 1px solid #eee;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-user-circle" style="font-size: 1.5rem; color: #666;"></i>
                            <div>
                                <div style="font-weight: 600;">${colaboradorCompleto.nome}</div>
                                <div style="font-size: 0.9rem; color: #666;">${colaboradorCompleto.cargo}</div>
                            </div>
                        </div>
                    </td>
            `;
            
            // Simular presenças
            let presencas = 0;
            for (let i = 0; i < totalAulas; i++) {
                const presente = Math.random() > 0.3; // 70% de chance de estar presente
                if (presente) presencas++;
                
                html += `
                    <td style="padding: 1rem; border-bottom: 1px solid #eee; text-align: center;">
                        <span style="display: inline-block; width: 25px; height: 25px; line-height: 25px; border-radius: 50%; background: ${presente ? '#4CAF50' : '#ff6b6b'}; color: white; font-weight: 600; cursor: pointer;" 
                              onclick="alterarPresenca(this, ${colab.id}, ${i})" 
                              title="${presente ? 'Presente - Clique para alterar' : 'Ausente - Clique para alterar'}">
                            ${presente ? 'P' : 'A'}
                        </span>
                    </td>
                `;
            }
            
            const percentual = totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 0;
            const corPercentual = percentual >= 80 ? '#4CAF50' : percentual >= 60 ? '#ff9800' : '#ff6b6b';
            
            html += `
                    <td style="padding: 1rem; border-bottom: 1px solid #eee; text-align: center; font-weight: 600;">${presencas}/${totalAulas}</td>
                    <td style="padding: 1rem; border-bottom: 1px solid #eee; text-align: center;">
                        <span style="background: ${corPercentual}; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 600;">${percentual}%</span>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }

    window.alterarPresenca = function(elemento, colaboradorId, aulaIndex) {
        const textoAtual = elemento.textContent;
        const novoTexto = textoAtual === 'P' ? 'A' : 'P';
        const novaCor = novoTexto === 'P' ? '#4CAF50' : '#ff6b6b';
        
        elemento.textContent = novoTexto;
        elemento.style.background = novaCor;
        elemento.title = novoTexto === 'P' ? 'Presente - Clique para alterar' : 'Ausente - Clique para alterar';
        
        console.log(`📝 Presença alterada: Colaborador ${colaboradorId}, Aula ${aulaIndex + 1} -> ${novoTexto === 'P' ? 'Presente' : 'Ausente'}`);
        
        // Em um sistema real, você salvaria no backend
        if (treinamentoAtual) {
            if (!treinamentoAtual.presencas) {
                treinamentoAtual.presencas = [];
            }
            
            // Atualizar no localStorage
            const index = treinamentos.findIndex(t => t.id === treinamentoAtual.id);
            if (index !== -1) {
                treinamentos[index] = treinamentoAtual;
                localStorage.setItem('rh_treinamentos', JSON.stringify(treinamentos));
            }
        }
    };

    window.filtrarAulaPresenca = function() {
        const select = document.getElementById('filtroAulaPresenca');
        if (!select) return;
        
        const aulaSelecionada = select.value;
        if (aulaSelecionada) {
            alert(`Filtrando pela aula: ${select.options[select.selectedIndex].text}`);
            // Em um sistema real, aqui você filtraria a tabela
        }
    };

    // ============ FUNÇÕES AUXILIARES ============
    window.editarTreinamentoAtual = function() {
        if (!treinamentoAtual) {
            alert('❌ Nenhum treinamento selecionado!');
            return;
        }
        editarTreinamento(treinamentoAtual.id);
    };

    window.solicitarTreinamentoAtual = function() {
        mostrarModalAtribuirColaboradores();
    };

    function calcularTotalAulas() {
        if (!treinamentoAtual.modulos) return 0;
        return treinamentoAtual.modulos.reduce((total, modulo) => 
            total + (modulo.aulas?.length || 0), 0
        );
    }

    function formatarData(data) {
        return data.toLocaleDateString('pt-BR');
    }

    window.filtrarColaboradoresAtribuidos = function() {
        const filtroDept = document.getElementById('filtroDepartamento');
        const filtroStatus = document.getElementById('filtroStatus');
        
        if (filtroDept && filtroStatus) {
            // Em um sistema real, aqui você filtraria a lista
            // Por enquanto, apenas recarregamos
            carregarColaboradoresVisualizacao();
        }
    };

    window.exportarRelatorioPresenca = function() {
        if (!treinamentoAtual) return;
        
        // Simular geração de relatório
        const totalAulas = calcularTotalAulas();
        const totalAlunos = treinamentoAtual.colaboradoresAtribuidos?.length || 0;
        
        alert(`📊 Relatório de presença gerado!\n\n` +
              `Treinamento: ${treinamentoAtual.titulo}\n` +
              `Total de aulas: ${totalAulas}\n` +
              `Total de alunos: ${totalAlunos}\n\n` +
              `O relatório foi salvo em formato PDF.`);
    };

    function filtrarTreinamentos() {
        const busca = document.getElementById('buscaTreinamento').value.toLowerCase();
        const cards = document.querySelectorAll('.card_treinamento');
        
        cards.forEach(card => {
            const titulo = card.querySelector('h3').textContent.toLowerCase();
            const instrutor = card.querySelector('.card-info-item:nth-child(1) span').textContent.toLowerCase();
            
            if (busca && !titulo.includes(busca) && !instrutor.includes(busca)) {
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
            }
        });
    }

    // ============ INICIAR SISTEMA ============
    inicializar();
    
    // Adicionar evento ao botão de treinamentos no dashboard
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'treinamentos-btn') {
            e.preventDefault();
            mostrarTela('treinamentos-screen');
        }
    });
});