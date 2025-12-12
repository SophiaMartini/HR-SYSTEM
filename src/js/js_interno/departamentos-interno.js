        // Dados de exemplo baseados no modelo físico do banco
        const departamentos = [
            {
                id_departamento: 1,
                nome: "Recursos Humanos",
                sigla: "RH",
                telefone: "(11) 3333-4444",
                localizacao: "Prédio Central, 3º andar, Sala 301",
                descricao: "Departamento responsável por gestão de pessoas, recrutamento e benefícios",
                id_gerente: 101,
                quantidadeColaboradores: 12
            },
            {
                id_departamento: 2,
                nome: "Tecnologia da Informação",
                sigla: "TI",
                telefone: "(11) 3333-5555",
                localizacao: "Prédio Anexo, 2º andar, Sala 210",
                descricao: "Departamento responsável por infraestrutura, sistemas e suporte técnico",
                id_gerente: null,
                quantidadeColaboradores: 8
            },
            {
                id_departamento: 3,
                nome: "Financeiro",
                sigla: "FIN",
                telefone: "(11) 3333-6666",
                localizacao: "Prédio Central, 2º andar, Sala 201",
                descricao: "Departamento responsável por contabilidade, orçamento e folha de pagamento",
                id_gerente: 103,
                quantidadeColaboradores: 15
            },
            {
                id_departamento: 4,
                nome: "Marketing",
                sigla: "MKT",
                telefone: "(11) 3333-7777",
                localizacao: "Prédio Criativo, 1º andar, Sala 105",
                descricao: "Departamento responsável por comunicação, branding e campanhas publicitárias",
                id_gerente: 104,
                quantidadeColaboradores: 10
            }
        ];

        const colaboradores = [
            { id_colaborador: 101, id_usuario: 201, nome: "Maria Silva", cargo: "Gerente de RH", departamento: "Recursos Humanos", data_admissao: "10/03/2020", salario: "R$ 12.500,00", tipo_contrato: "CLT" },
            { id_colaborador: 102, id_usuario: 202, nome: "João Santos", cargo: "Analista de Recrutamento", departamento: "Recursos Humanos", data_admissao: "15/06/2021", salario: "R$ 6.800,00", tipo_contrato: "CLT" },
            { id_colaborador: 103, id_usuario: 203, nome: "Carlos Oliveira", cargo: "Gerente Financeiro", departamento: "Financeiro", data_admissao: "05/01/2019", salario: "R$ 15.000,00", tipo_contrato: "CLT" },
            { id_colaborador: 104, id_usuario: 204, nome: "Ana Costa", cargo: "Gerente de Marketing", departamento: "Marketing", data_admissao: "22/09/2020", salario: "R$ 13.200,00", tipo_contrato: "CLT" },
            { id_colaborador: 105, id_usuario: 205, nome: "Pedro Almeida", cargo: "Desenvolvedor Sênior", departamento: "Tecnologia da Informação", data_admissao: "18/11/2022", salario: "R$ 11.500,00", tipo_contrato: "CLT" },
            { id_colaborador: 106, id_usuario: 206, nome: "Fernanda Lima", cargo: "Analista Financeiro", departamento: "Financeiro", data_admissao: "03/04/2021", salario: "R$ 7.200,00", tipo_contrato: "CLT" }
        ];

        const cargos = [
            { id_cargo: 1, id_departamento: 1, titulo: "Analista de RH", descricao: "Responsável por processos de recrutamento e seleção", vagas_abertas: 2 },
            { id_cargo: 2, id_departamento: 1, titulo: "Assistente de RH", descricao: "Auxilia nos processos administrativos do departamento", vagas_abertas: 1 },
            { id_cargo: 3, id_departamento: 2, titulo: "Desenvolvedor Full Stack", descricao: "Desenvolvimento de sistemas web e mobile", vagas_abertas: 3 },
            { id_cargo: 4, id_departamento: 2, titulo: "Analista de Infraestrutura", descricao: "Gestão de servidores e redes corporativas", vagas_abertas: 1 },
            { id_cargo: 5, id_departamento: 3, titulo: "Contador", descricao: "Responsável pela contabilidade da empresa", vagas_abertas: 0 },
            { id_cargo: 6, id_departamento: 4, titulo: "Designer Gráfico", descricao: "Criação de materiais visuais para campanhas", vagas_abertas: 2 }
        ];

        const usuarios = [
            { id: 201, nome: "Maria Silva", email: "maria.silva@empresa.com", cpf: "111.222.333-44", data_nascimento: "15/05/1985", celular: "(11) 98888-1111", estado_civil: "Casada", genero: "Feminino" },
            { id: 202, nome: "João Santos", email: "joao.santos@empresa.com", cpf: "222.333.444-55", data_nascimento: "22/08/1990", celular: "(11) 97777-2222", estado_civil: "Solteiro", genero: "Masculino" },
            { id: 203, nome: "Carlos Oliveira", email: "carlos.oliveira@empresa.com", cpf: "333.444.555-66", data_nascimento: "10/12/1978", celular: "(11) 96666-3333", estado_civil: "Casado", genero: "Masculino" }
        ];

        const enderecos = [
            { id_usuario: 201, endereco: "Av. Paulista, 1000", bairro: "Bela Vista", cidade: "São Paulo", estado: "SP" },
            { id_usuario: 202, endereco: "Rua Augusta, 500", bairro: "Consolação", cidade: "São Paulo", estado: "SP" },
            { id_usuario: 203, endereco: "Rua da Consolação, 200", bairro: "Centro", cidade: "São Paulo", estado: "SP" }
        ];

        // Estado da aplicação
        let currentDepartamentoId = null;
        let currentEditId = null;

        // Funções de inicialização
        document.addEventListener('DOMContentLoaded', function() {
            renderCards();
            setupEventListeners();
        });

        // Configurar event listeners
        function setupEventListeners() {
            // Botão de adicionar departamento
            document.getElementById('dt-btn-adicionar-departamento').addEventListener('click', openModal);
            
            // Botões do modal de departamento
            document.getElementById('dt-modal-close').addEventListener('click', closeModal);
            document.getElementById('dt-btn-cancelar').addEventListener('click', closeModal);
            document.getElementById('dt-btn-salvar').addEventListener('click', saveDepartamento);
            
            // Botões do modal de visualização
            document.getElementById('dt-view-modal-close').addEventListener('click', closeViewModal);
            document.getElementById('dt-btn-fechar-view').addEventListener('click', closeViewModal);
            document.getElementById('dt-btn-edicao-avancada').addEventListener('click', openAdvancedEdit);
            document.getElementById('dt-btn-novo-cargo').addEventListener('click', openNovoCargo);
            
            // Botões do modal de colaborador
            document.getElementById('dt-colaborador-modal-close').addEventListener('click', closeColaboradorModal);
            document.getElementById('dt-btn-fechar-colaborador').addEventListener('click', closeColaboradorModal);
            
            // Tabs
            document.querySelectorAll('.dt-tab-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    openTab(this.dataset.tab);
                });
            });
            
            // Filtro de busca
            document.getElementById('searchInput').addEventListener('keyup', filterDepartments);
            
            // Filtro de colaboradores
            document.getElementById('dt-search-colaborador').addEventListener('keyup', filterColaboradores);
            document.getElementById('dt-filter-ordem').addEventListener('change', filterColaboradores);
        }

        // Renderizar cards de departamentos
        function renderCards() {
            const container = document.getElementById('cardsContainer');
            container.innerHTML = '';
            
            departamentos.forEach(depto => {
                // Encontrar nome do gerente
                let gerenteNome = "Não atribuído";
                if (depto.id_gerente) {
                    const gerente = colaboradores.find(col => col.id_colaborador === depto.id_gerente);
                    if (gerente) gerenteNome = gerente.nome;
                }
                
                const card = document.createElement('div');
                card.className = 'dt-card';
                card.setAttribute('data-id', depto.id_departamento);
                card.innerHTML = `
                    <div class="dt-card-header">
                        <h3 class="dt-department-title">${depto.nome}</h3>
                        <span class="dt-department-sigla">${depto.sigla}</span>
                    </div>
                    <div class="dt-card-body">
                        <div class="dt-info-line">
                            <span class="dt-info-label">Gerente:</span>
                            <span class="dt-info-value ${!depto.id_gerente ? 'dt-no-manager' : ''}">${gerenteNome}</span>
                        </div>
                        <div class="dt-info-line">
                            <span class="dt-info-label">Telefone:</span>
                            <span class="dt-info-value">${depto.telefone}</span>
                        </div>
                        <div class="dt-info-line">
                            <span class="dt-info-label">Colaboradores:</span>
                            <span class="dt-info-value">${depto.quantidadeColaboradores}</span>
                        </div>
                        <div class="dt-info-line">
                            <span class="dt-info-label">Local:</span>
                            <span class="dt-info-value">${depto.localizacao || 'Não informado'}</span>
                        </div>
                        <div class="dt-info-line">
                            <span class="dt-info-label">Descrição:</span>
                            <span class="dt-info-value">${depto.descricao.substring(0, 80)}${depto.descricao.length > 80 ? '...' : ''}</span>
                        </div>
                    </div>
                    <div class="dt-card-footer">
                        <button class="dt-action-btn dt-btn-edit" data-id="${depto.id_departamento}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="dt-action-btn dt-btn-view" data-id="${depto.id_departamento}">
                            <i class="fas fa-eye"></i> Visualizar
                        </button>
                        <button class="dt-action-btn dt-btn-delete" data-id="${depto.id_departamento}">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
            
            // Adicionar eventos aos botões dos cards
            document.querySelectorAll('.dt-btn-edit').forEach(btn => {
                btn.addEventListener('click', function() {
                    editDepartamento(parseInt(this.dataset.id));
                });
            });
            
            document.querySelectorAll('.dt-btn-view').forEach(btn => {
                btn.addEventListener('click', function() {
                    viewDepartamento(parseInt(this.dataset.id));
                });
            });
            
            document.querySelectorAll('.dt-btn-delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    deleteDepartamento(parseInt(this.dataset.id));
                });
            });
        }

        // Filtrar departamentos
        function filterDepartments() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const cards = document.querySelectorAll('.dt-card');
            
            cards.forEach(card => {
                const title = card.querySelector('.dt-department-title').textContent.toLowerCase();
                const sigla = card.querySelector('.dt-department-sigla').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || sigla.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Modal de criação/edição
        function openModal(id = null) {
            const modal = document.getElementById('dt-modal-departamento');
            const title = document.getElementById('dt-modal-title');
            
            if (id) {
                title.textContent = "Editar Departamento";
                currentEditId = id;
                const depto = departamentos.find(d => d.id_departamento === id);
                
                if (depto) {
                    document.getElementById('dt-nome').value = depto.nome;
                    document.getElementById('dt-sigla').value = depto.sigla;
                    document.getElementById('dt-telefone').value = depto.telefone;
                    document.getElementById('dt-local').value = depto.localizacao || '';
                    document.getElementById('dt-descricao').value = depto.descricao;
                }
            } else {
                title.textContent = "Novo Departamento";
                document.getElementById('dt-form-departamento').reset();
                currentEditId = null;
            }
            
            modal.style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('dt-modal-departamento').style.display = 'none';
            document.getElementById('dt-form-departamento').reset();
            currentEditId = null;
        }

        function saveDepartamento() {
            const nome = document.getElementById('dt-nome').value;
            const sigla = document.getElementById('dt-sigla').value;
            const telefone = document.getElementById('dt-telefone').value;
            const local = document.getElementById('dt-local').value;
            const descricao = document.getElementById('dt-descricao').value;
            
            if (!nome || !sigla || !telefone) {
                alert('Por favor, preencha os campos obrigatórios (Nome, Sigla e Telefone)');
                return;
            }
            
            if (currentEditId) {
                // Editar departamento existente
                const index = departamentos.findIndex(d => d.id_departamento === currentEditId);
                if (index !== -1) {
                    departamentos[index] = {
                        ...departamentos[index],
                        nome,
                        sigla,
                        telefone,
                        localizacao: local,
                        descricao
                    };
                }
            } else {
                // Criar novo departamento
                const newId = departamentos.length > 0 ? 
                    Math.max(...departamentos.map(d => d.id_departamento)) + 1 : 1;
                
                departamentos.push({
                    id_departamento: newId,
                    nome,
                    sigla,
                    telefone,
                    localizacao: local,
                    descricao,
                    id_gerente: null,
                    quantidadeColaboradores: 0
                });
            }
            
            renderCards();
            closeModal();
            alert(currentEditId ? 'Departamento atualizado com sucesso!' : 'Departamento criado com sucesso!');
        }

        // Modal de visualização
        function viewDepartamento(id) {
            currentDepartamentoId = id;
            const depto = departamentos.find(d => d.id_departamento === id);
            if (!depto) return;
            
            // Preencher informações da aba de informações gerais
            document.getElementById('dt-view-departamento-title').textContent = depto.nome;
            document.getElementById('dt-view-nome').textContent = depto.nome;
            document.getElementById('dt-view-sigla').textContent = depto.sigla;
            
            // Encontrar nome do gerente
            let gerenteNome = "Não atribuído";
            let gerenteBtn = "";
            if (depto.id_gerente) {
                const gerente = colaboradores.find(col => col.id_colaborador === depto.id_gerente);
                if (gerente) gerenteNome = gerente.nome;
            } else {
                gerenteBtn = `<button class="btn-defaunt" style="margin-left: 10px; padding: 5px 10px; font-size: 0.9rem;" onclick="atribuirGerente(${id})">Atribuir Gerente</button>`;
            }
            
            document.getElementById('dt-view-gerente').innerHTML = gerenteNome + gerenteBtn;
            document.getElementById('dt-view-telefone').textContent = depto.telefone;
            document.getElementById('dt-view-local').textContent = depto.localizacao || 'Não informado';
            document.getElementById('dt-view-colaboradores').textContent = depto.quantidadeColaboradores;
            document.getElementById('dt-view-descricao').textContent = depto.descricao;
            
            // Listar cargos do departamento
            const cargosDepto = cargos.filter(cargo => cargo.id_departamento === id);
            let cargosHTML = '<ul style="margin-top: 5px;">';
            cargosDepto.forEach(cargo => {
                cargosHTML += `<li>${cargo.titulo} (${cargo.vagas_abertas} vaga(s) aberta(s))</li>`;
            });
            cargosHTML += '</ul>';
            document.getElementById('dt-view-cargos').innerHTML = cargosDepto.length > 0 ? cargosHTML : 'Nenhum cargo cadastrado';
            
            // Carregar colaboradores do departamento
            loadColaboradoresDepto(id);
            
            // Carregar cargos do departamento
            loadCargosDepto(id);
            
            // Abrir modal
            document.getElementById('dt-modal-view-departamento').style.display = 'flex';
            
            // Garantir que a primeira aba está ativa
            openTab('info');
        }

        function closeViewModal() {
            document.getElementById('dt-modal-view-departamento').style.display = 'none';
            currentDepartamentoId = null;
        }

        // Trocar abas
        function openTab(tabName) {
            // Remover classe active de todas as abas
            document.querySelectorAll('.dt-tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.dt-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Adicionar classe active na aba selecionada
            document.querySelector(`.dt-tab-btn[data-tab="${tabName}"]`).classList.add('active');
            document.getElementById(`dt-tab-${tabName}`).classList.add('active');
        }

        // Carregar colaboradores do departamento
        function loadColaboradoresDepto(departamentoId) {
            const deptoNome = departamentos.find(d => d.id_departamento === departamentoId).nome;
            const colaboradoresDepto = colaboradores.filter(col => col.departamento === deptoNome);
            
            const tbody = document.getElementById('dt-table-colaboradores-body');
            tbody.innerHTML = '';
            
            colaboradoresDepto.forEach(col => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${col.nome}</td>
                    <td>${col.cargo}</td>
                    <td>${col.data_admissao}</td>
                    <td class="dt-table-actions">
                        <button class="dt-action-btn dt-btn-view" data-colaborador-id="${col.id_colaborador}">
                            <i class="fas fa-eye"></i> Visualizar
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Adicionar eventos aos botões de visualizar colaborador
            document.querySelectorAll('[data-colaborador-id]').forEach(btn => {
                btn.addEventListener('click', function() {
                    viewColaboradorDetalhado(parseInt(this.dataset.colaboradorId));
                });
            });
            
            // Configurar eventos de filtro
            document.getElementById('dt-search-colaborador').addEventListener('keyup', filterColaboradores);
            document.getElementById('dt-filter-ordem').addEventListener('change', filterColaboradores);
        }

        // Carregar cargos do departamento
        function loadCargosDepto(departamentoId) {
            const cargosDepto = cargos.filter(cargo => cargo.id_departamento === departamentoId);
            
            const tbody = document.getElementById('dt-table-cargos-body');
            tbody.innerHTML = '';
            
            cargosDepto.forEach(cargo => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cargo.titulo}</td>
                    <td>${cargo.descricao}</td>
                    <td>${cargo.vagas_abertas}</td>
                    <td class="dt-table-actions">
                        <button class="dt-action-btn dt-btn-edit">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // Filtrar colaboradores
        function filterColaboradores() {
            const searchTerm = document.getElementById('dt-search-colaborador').value.toLowerCase();
            const ordem = document.getElementById('dt-filter-ordem').value;
            
            const deptoNome = departamentos.find(d => d.id_departamento === currentDepartamentoId).nome;
            const colaboradoresDepto = colaboradores.filter(col => col.departamento === deptoNome);
            
            // Aplicar filtro de busca
            let filtered = colaboradoresDepto.filter(col => 
                col.nome.toLowerCase().includes(searchTerm) || 
                col.cargo.toLowerCase().includes(searchTerm)
            );
            
            // Aplicar ordenação
            if (ordem === 'az') {
                filtered.sort((a, b) => a.nome.localeCompare(b.nome));
            } else if (ordem === 'za') {
                filtered.sort((a, b) => b.nome.localeCompare(a.nome));
            }
            
            // Atualizar tabela
            const tbody = document.getElementById('dt-table-colaboradores-body');
            tbody.innerHTML = '';
            
            filtered.forEach(col => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${col.nome}</td>
                    <td>${col.cargo}</td>
                    <td>${col.data_admissao}</td>
                    <td class="dt-table-actions">
                        <button class="dt-action-btn dt-btn-view" data-colaborador-id="${col.id_colaborador}">
                            <i class="fas fa-eye"></i> Visualizar
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Re-adicionar eventos aos botões
            document.querySelectorAll('[data-colaborador-id]').forEach(btn => {
                btn.addEventListener('click', function() {
                    viewColaboradorDetalhado(parseInt(this.dataset.colaboradorId));
                });
            });
        }

        // Visualizar colaborador detalhado
        function viewColaboradorDetalhado(idColaborador) {
            const colaborador = colaboradores.find(col => col.id_colaborador === idColaborador);
            if (!colaborador) return;
            
            // Encontrar usuário associado
            const usuario = usuarios.find(user => user.id === colaborador.id_usuario);
            const endereco = enderecos.find(addr => addr.id_usuario === colaborador.id_usuario);
            
            // Preencher informações
            document.getElementById('dt-colaborador-nome').textContent = colaborador.nome;
            document.getElementById('dt-colaborador-cargo').textContent = colaborador.cargo;
            
            if (usuario) {
                document.getElementById('dt-colaborador-cpf').textContent = usuario.cpf;
                document.getElementById('dt-colaborador-nascimento').textContent = usuario.data_nascimento;
                document.getElementById('dt-colaborador-genero').textContent = usuario.genero;
                document.getElementById('dt-colaborador-estado-civil').textContent = usuario.estado_civil;
                document.getElementById('dt-colaborador-email').textContent = usuario.email;
                document.getElementById('dt-colaborador-celular').textContent = usuario.celular;
            }
            
            document.getElementById('dt-colaborador-departamento').textContent = colaborador.departamento;
            document.getElementById('dt-colaborador-cargo-info').textContent = colaborador.cargo;
            document.getElementById('dt-colaborador-admissao').textContent = colaborador.data_admissao;
            document.getElementById('dt-colaborador-salario').textContent = colaborador.salario;
            document.getElementById('dt-colaborador-contrato').textContent = colaborador.tipo_contrato;
            
            if (endereco) {
                document.getElementById('dt-colaborador-endereco').textContent = endereco.endereco;
                document.getElementById('dt-colaborador-bairro').textContent = endereco.bairro;
                document.getElementById('dt-colaborador-cidade').textContent = `${endereco.cidade}/${endereco.estado}`;
            }
            
            // Abrir modal
            document.getElementById('dt-modal-colaborador-detalhado').style.display = 'flex';
        }

        function closeColaboradorModal() {
            document.getElementById('dt-modal-colaborador-detalhado').style.display = 'none';
        }

        // Função para atribuir gerente (simulação)
        function atribuirGerente(departamentoId) {
            const deptoNome = departamentos.find(d => d.id_departamento === departamentoId).nome;
            const colaboradoresDepto = colaboradores.filter(col => col.departamento === deptoNome);
            
            if (colaboradoresDepto.length === 0) {
                alert('Não há colaboradores neste departamento para atribuir como gerente.');
                return;
            }
            
            // Simulação: atribuir o primeiro colaborador como gerente
            const deptoIndex = departamentos.findIndex(d => d.id_departamento === departamentoId);
            if (deptoIndex !== -1) {
                departamentos[deptoIndex].id_gerente = colaboradoresDepto[0].id_colaborador;
                renderCards();
                viewDepartamento(departamentoId); // Atualizar a view
                alert(`Gerente atribuído: ${colaboradoresDepto[0].nome}`);
            }
        }

        // Edição rápida
        function editDepartamento(id) {
            openModal(id);
        }

        // Edição avançada
        function openAdvancedEdit() {
            if (!currentDepartamentoId) return;
            
            // Em uma implementação real, isso abriria outro modal com mais opções
            // Por enquanto, vamos apenas permitir editar pelo modal existente
            closeViewModal();
            setTimeout(() => {
                openModal(currentDepartamentoId);
            }, 300);
        }

        // Novo cargo
        function openNovoCargo() {
            alert('Funcionalidade de novo cargo será implementada aqui!');
            // Em uma implementação completa, isso abriria um modal para criar um novo cargo
        }

        // Excluir departamento
        function deleteDepartamento(id) {
            if (confirm('Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita.')) {
                const index = departamentos.findIndex(d => d.id_departamento === id);
                if (index !== -1) {
                    departamentos.splice(index, 1);
                    renderCards();
                    alert('Departamento excluído com sucesso!');
                }
            }
        }

        // Expor funções para o escopo global (se necessário)
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.saveDepartamento = saveDepartamento;
        window.viewDepartamento = viewDepartamento;
        window.closeViewModal = closeViewModal;
        window.openTab = openTab;
        window.viewColaboradorDetalhado = viewColaboradorDetalhado;
        window.closeColaboradorModal = closeColaboradorModal;
        window.atribuirGerente = atribuirGerente;
        window.editDepartamento = editDepartamento;
        window.openAdvancedEdit = openAdvancedEdit;
        window.openNovoCargo = openNovoCargo;
        window.deleteDepartamento = deleteDepartamento;
        window.filterDepartments = filterDepartments;
        window.filterColaboradores = filterColaboradores;