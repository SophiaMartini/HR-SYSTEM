   window.openModal = function(id = null) {
            console.log("Abrindo modal..."); // Para debug
            const modal = document.getElementById('dt-modal-departamento');
            const title = document.getElementById('dt-modal-title');
            
            if (id) {
                title.textContent = "Editar Departamento";
                window.currentEditId = id;
                // Aqui você buscaria os dados do departamento para edição
            } else {
                title.textContent = "Novo Departamento";
                document.getElementById('dt-form-departamento').reset();
                window.currentEditId = null;
            }
            
            modal.style.display = 'flex';
        };

        window.closeModal = function() {
            document.getElementById('dt-modal-departamento').style.display = 'none';
            document.getElementById('dt-form-departamento').reset();
            window.currentEditId = null;
        };

        window.saveDepartamento = function() {
            const nome = document.getElementById('dt-nome').value;
            const sigla = document.getElementById('dt-sigla').value;
            const telefone = document.getElementById('dt-telefone').value;
            const local = document.getElementById('dt-local').value;
            const descricao = document.getElementById('dt-descricao').value;
            
            if (!nome || !sigla || !telefone) {
                alert('Por favor, preencha os campos obrigatórios (Nome, Sigla e Telefone)');
                return;
            }
            
            // Aqui você faria a lógica para salvar no banco de dados
            // Por enquanto, só vamos mostrar um alerta
            alert(`Departamento ${window.currentEditId ? 'atualizado' : 'criado'} com sucesso!\n\nNome: ${nome}\nSigla: ${sigla}\nTelefone: ${telefone}\nLocal: ${local || 'Não informado'}`);
            
            closeModal();
        };

        window.filterDepartments = function() {
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
        };

        // Dados de exemplo
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
            }
        ];

        // Inicialização quando a página carrega
        document.addEventListener('DOMContentLoaded', function() {
            console.log("DOM carregado, configurando eventos...");
            
            // 1. Botão de adicionar departamento
            document.getElementById('dt-btn-adicionar-departamento').addEventListener('click', function() {
                console.log("Botão clicado!");
                window.openModal();
            });
            
            // 2. Botões do modal
            document.getElementById('dt-modal-close').addEventListener('click', window.closeModal);
            document.getElementById('dt-btn-cancelar').addEventListener('click', window.closeModal);
            document.getElementById('dt-btn-salvar').addEventListener('click', window.saveDepartamento);
            
            // 3. Filtro de busca
            document.getElementById('searchInput').addEventListener('keyup', window.filterDepartments);
            
            // 4. Renderizar cards iniciais
            renderCards();
            
            console.log("Eventos configurados com sucesso!");
        });

        function renderCards() {
            const container = document.getElementById('cardsContainer');
            container.innerHTML = '';
            
            departamentos.forEach(depto => {
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
                            <span class="dt-info-value ${!depto.id_gerente ? 'dt-no-manager' : ''}">${depto.id_gerente ? 'Maria Silva' : 'Não atribuído'}</span>
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
                        <button class="dt-action-btn dt-btn-edit" onclick="window.openModal(${depto.id_departamento})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="dt-action-btn dt-btn-view" onclick="alert('Visualizar departamento ${depto.nome}')">
                            <i class="fas fa-eye"></i> Visualizar
                        </button>
                        <button class="dt-action-btn dt-btn-delete" onclick="if(confirm('Excluir departamento?')) alert('Departamento excluído!')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        }