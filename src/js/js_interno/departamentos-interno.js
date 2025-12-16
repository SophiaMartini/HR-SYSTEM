// CLASSE PRINCIPAL PARA GERENCIAR DEPARTAMENTOS
class DT_Departamentos {
    static departamentos = JSON.parse(localStorage.getItem('departamentos')) || [];
    static cargos = JSON.parse(localStorage.getItem('cargos')) || [];
    static departamentoAtual = null;
    static modoEdicao = false;
    static departamentoEditando = null;
    static colaboradores = JSON.parse(localStorage.getItem('colaboradores')) || [];
    static gerenteSelecionado = null;

    // INICIALIZAÇÃO
    static init() {
        this.carregarDepartamentos();
        this.carregarCargos();
        this.carregarColaboradores();
        this.criarDepartamentosExemplo();
    }

    // CARREGAR DADOS
    static carregarDepartamentos() {
        this.departamentos = JSON.parse(localStorage.getItem('departamentos')) || [];
    }

    static carregarCargos() {
        this.cargos = JSON.parse(localStorage.getItem('cargos')) || [];
    }

    static carregarColaboradores() {
        this.colaboradores = JSON.parse(localStorage.getItem('colaboradores')) || [];
    }

    // SALVAR DADOS
    static salvarNoStorage() {
        localStorage.setItem('departamentos', JSON.stringify(this.departamentos));
        localStorage.setItem('cargos', JSON.stringify(this.cargos));
    }

    // CRIAR DADOS DE EXEMPLO (APENAS PARA TESTE)
    static criarDepartamentosExemplo() {
        if (this.departamentos.length === 0) {
            this.departamentos = [
                {
                    id: 1,
                    nome: "Recursos Humanos",
                    sigla: "RH",
                    telefone: "(11) 3333-4444",
                    local: "Prédio A, 2º Andar",
                    descricao: "Responsável por gestão de pessoas, recrutamento e treinamento.",
                    idGerente: null,
                    colaboradores: [1, 2]
                },
                {
                    id: 2,
                    nome: "Tecnologia da Informação",
                    sigla: "TI",
                    telefone: "(11) 3333-5555",
                    local: "Prédio B, 3º Andar",
                    descricao: "Suporte técnico, desenvolvimento e infraestrutura de TI.",
                    idGerente: null,
                    colaboradores: [3]
                },
                {
                    id: 3,
                    nome: "Financeiro",
                    sigla: "FIN",
                    telefone: "(11) 3333-6666",
                    local: "Prédio A, 1º Andar",
                    descricao: "Gestão financeira, contabilidade e folha de pagamento.",
                    idGerente: null,
                    colaboradores: []
                }
            ];
            
            this.cargos = [
                { id: 1, nome: "Analista de RH", idDepartamento: 1 },
                { id: 2, nome: "Recrutador", idDepartamento: 1 },
                { id: 3, nome: "Desenvolvedor", idDepartamento: 2 },
                { id: 4, nome: "Analista Financeiro", idDepartamento: 3 }
            ];

            this.salvarNoStorage();
        }
    }

    // GERAR NOVO ID
    static gerarNovoId(array) {
        return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
    }

    // ABRIR MODAL DE CRIAÇÃO
    static abrirModalCriacao() {
        this.modoEdicao = false;
        this.departamentoEditando = null;
        
        document.getElementById('dt-modal-titulo').textContent = 'Novo Departamento';
        document.getElementById('dt-nome').value = '';
        document.getElementById('dt-sigla').value = '';
        document.getElementById('dt-telefone').value = '';
        document.getElementById('dt-local').value = '';
        document.getElementById('dt-descricao').value = '';
        
        document.getElementById('dt-modal-departamento').style.display = 'flex';
    }

    // ABRIR MODAL DE EDIÇÃO
    static abrirModalEdicao(departamentoId) {
        const departamento = this.departamentos.find(d => d.id === departamentoId);
        if (!departamento) return;

        this.modoEdicao = true;
        this.departamentoEditando = departamento;
        
        document.getElementById('dt-modal-titulo').textContent = 'Editar Departamento';
        document.getElementById('dt-nome').value = departamento.nome;
        document.getElementById('dt-sigla').value = departamento.sigla;
        document.getElementById('dt-telefone').value = departamento.telefone || '';
        document.getElementById('dt-local').value = departamento.local || '';
        document.getElementById('dt-descricao').value = departamento.descricao || '';
        
        document.getElementById('dt-modal-departamento').style.display = 'flex';
    }

    // FECHAR MODAL
    static fecharModal() {
        document.getElementById('dt-modal-departamento').style.display = 'none';
    }

    // SALVAR DEPARTAMENTO (CRIAR OU EDITAR)
    static salvar() {
        const nome = document.getElementById('dt-nome').value.trim();
        const sigla = document.getElementById('dt-sigla').value.trim();
        const telefone = document.getElementById('dt-telefone').value.trim();
        const local = document.getElementById('dt-local').value.trim();
        const descricao = document.getElementById('dt-descricao').value.trim();

        if (!nome || !sigla) {
            alert('Preencha pelo menos o nome e a sigla do departamento!');
            return;
        }

        if (this.modoEdicao && this.departamentoEditando) {
            // EDITAR
            const index = this.departamentos.findIndex(d => d.id === this.departamentoEditando.id);
            if (index !== -1) {
                this.departamentos[index] = {
                    ...this.departamentos[index],
                    nome,
                    sigla,
                    telefone,
                    local,
                    descricao
                };
            }
        } else {
            // CRIAR NOVO
            const novoDepartamento = {
                id: this.gerarNovoId(this.departamentos),
                nome,
                sigla,
                telefone,
                local,
                descricao,
                idGerente: null,
                colaboradores: []
            };
            this.departamentos.push(novoDepartamento);
        }

        this.salvarNoStorage();
        this.carregarGrid();
        this.fecharModal();
        
        this.mostrarMensagem('Departamento salvo com sucesso!', 'success');
    }

    // EXCLUIR DEPARTAMENTO
    static excluirDepartamento(departamentoId) {
        if (!confirm('Tem certeza que deseja excluir este departamento?')) {
            return;
        }

        // Verificar se há colaboradores no departamento
        const departamento = this.departamentos.find(d => d.id === departamentoId);
        if (departamento && (departamento.colaboradores || []).length > 0) {
            if (!confirm('Este departamento possui colaboradores. A exclusão removerá todas as associações. Continuar?')) {
                return;
            }
        }

        // Remover cargos do departamento
        this.cargos = this.cargos.filter(cargo => cargo.idDepartamento !== departamentoId);
        
        // Remover departamento
        this.departamentos = this.departamentos.filter(d => d.id !== departamentoId);
        
        // Atualizar colaboradores (remover associação com o departamento)
        this.colaboradores = this.colaboradores.map(colab => {
            if (colab.idDepartamento === departamentoId) {
                return { ...colab, idDepartamento: null };
            }
            return colab;
        });

        this.salvarNoStorage();
        localStorage.setItem('colaboradores', JSON.stringify(this.colaboradores));
        this.carregarGrid();
        
        this.mostrarMensagem('Departamento excluído com sucesso!', 'success');
    }

    // CARREGAR GRID DE DEPARTAMENTOS
    static carregarGrid() {
        const grid = document.getElementById('dt-grid-departamentos');
        if (!grid) return;

        grid.innerHTML = '';

        this.departamentos.forEach(departamento => {
            const gerente = departamento.idGerente ? 
                this.colaboradores.find(c => c.id === departamento.idGerente) : null;
            
            const qtdColaboradores = departamento.colaboradores ? departamento.colaboradores.length : 0;

            const card = document.createElement('div');
            card.className = 'card-departamento';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-titulo">
                        <h3>${departamento.nome}</h3>
                    </div>
                    <div class="card-sigla">${departamento.sigla}</div>
                </div>
                
                <div class="card-info">
                    <div class="info-item-card">
                        <i class="fas fa-user-tie"></i>
                        <span>Gerente: ${gerente ? gerente.nome : 'Não atribuído'}</span>
                    </div>
                    <div class="info-item-card">
                        <i class="fas fa-phone"></i>
                        <span>${departamento.telefone || 'Não informado'}</span>
                    </div>
                    <div class="info-item-card">
                        <i class="fas fa-users"></i>
                        <span>${qtdColaboradores} colaborador(es)</span>
                    </div>
                    <div class="info-item-card">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${departamento.local || 'Não informado'}</span>
                    </div>
                </div>
                
                <div class="card-descricao" title="${departamento.descricao || ''}">
                    ${departamento.descricao || 'Sem descrição'}
                </div>
                
                <div class="card-dt">
                    <button class="btn-card btn-editar" onclick="DT_Departamentos.abrirModalEdicao(${departamento.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-card btn-visualizar" onclick="DT_Departamentos.visualizarDepartamento(${departamento.id})">
                        <i class="fas fa-eye"></i> Visualizar
                    </button>
                    <button class="btn-card btn-excluir" onclick="DT_Departamentos.excluirDepartamento(${departamento.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    // VISUALIZAR DEPARTAMENTO
    static visualizarDepartamento(departamentoId) {
        this.departamentoAtual = this.departamentos.find(d => d.id === departamentoId);
        if (!this.departamentoAtual) return;

        // Esconder grid e mostrar view
        document.getElementById('departamentos-screen').style.display = 'none';
        document.getElementById('dt-view-screen').style.display = 'block';

        this.carregarViewDepartamento();
    }

    // CARREGAR VIEW DO DEPARTAMENTO
    static carregarViewDepartamento() {
        if (!this.departamentoAtual) return;

        // Informações básicas
        document.getElementById('dt-view-nome').textContent = this.departamentoAtual.nome;
        document.getElementById('dt-info-nome').textContent = this.departamentoAtual.nome;
        document.getElementById('dt-info-sigla').textContent = this.departamentoAtual.sigla;
        document.getElementById('dt-info-telefone').textContent = this.departamentoAtual.telefone || 'Não informado';
        document.getElementById('dt-info-local').textContent = this.departamentoAtual.local || 'Não informado';
        document.getElementById('dt-info-descricao').textContent = this.departamentoAtual.descricao || 'Sem descrição';
        
        // Gerente
        if (this.departamentoAtual.idGerente) {
            const gerente = this.colaboradores.find(c => c.id === this.departamentoAtual.idGerente);
            document.getElementById('dt-info-gerente').textContent = gerente ? gerente.nome : 'Não atribuído';
        } else {
            document.getElementById('dt-info-gerente').textContent = 'Não atribuído';
        }
        
        // Colaboradores
        const qtdColaboradores = this.departamentoAtual.colaboradores ? this.departamentoAtual.colaboradores.length : 0;
        document.getElementById('dt-info-colaboradores').textContent = qtdColaboradores;
        document.getElementById('dt-total-colabs').textContent = `${qtdColaboradores} colaborador(es)`;

        // Carregar cargos
        this.carregarCargosView();
        
        // Carregar colaboradores
        this.carregarColaboradoresView();
        
        // Garantir que a aba info está ativa
        this.mudarAba('info');
    }

    // MUDAR ABA
    static mudarAba(aba) {
        // Remover active de todas as abas
        document.querySelectorAll('.aba-departamento').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.aba-conteudo-departamento').forEach(content => {
            content.classList.remove('active');
        });
        
        // Ativar aba selecionada
        document.querySelector(`.aba-departamento[data-aba="${aba}"]`).classList.add('active');
        document.getElementById(`dt-aba-${aba}`).classList.add('active');
    }

    // VOLTAR PARA GRID
    static voltarParaGrid() {
        document.getElementById('dt-view-screen').style.display = 'none';
        document.getElementById('departamentos-screen').style.display = 'block';
        
        this.departamentoAtual = null;
        this.carregarGrid();
    }

    // ABRIR MODAL GERENTE
    static abrirModalGerente() {
        this.gerenteSelecionado = null;
        
        // Carregar lista de colaboradores
        const lista = document.getElementById('dt-lista-gerentes');
        lista.innerHTML = '';
        
        this.colaboradores.forEach(colab => {
            const item = document.createElement('div');
            item.className = 'item-colaborador';
            item.innerHTML = `
                <div class="info-colab">
                    <strong>${colab.nome}</strong>
                    <span>${colab.cargo || 'Sem cargo'}</span>
                </div>
                <button class="btn-select-gerente" onclick="DT_Departamentos.selecionarGerente(${colab.id}, this)">
                    <i class="fas fa-check"></i> Selecionar
                </button>
            `;
            lista.appendChild(item);
        });
        
        document.getElementById('dt-modal-gerente').style.display = 'flex';
    }

    static selecionarGerente(colabId, element) {
        // Remover seleção anterior
        document.querySelectorAll('.btn-select-gerente').forEach(btn => {
            btn.classList.remove('selected');
            btn.innerHTML = '<i class="fas fa-check"></i> Selecionar';
        });
        
        // Selecionar novo
        element.classList.add('selected');
        element.innerHTML = '<i class="fas fa-check-circle"></i> Selecionado';
        
        this.gerenteSelecionado = colabId;
    }

    static fecharModalGerente() {
        document.getElementById('dt-modal-gerente').style.display = 'none';
    }

    static salvarGerente() {
        if (!this.gerenteSelecionado || !this.departamentoAtual) {
            alert('Selecione um colaborador!');
            return;
        }

        // Atualizar departamento
        const index = this.departamentos.findIndex(d => d.id === this.departamentoAtual.id);
        if (index !== -1) {
            this.departamentos[index].idGerente = this.gerenteSelecionado;
        }

        // Atualizar colaborador (adicionar flag de gerente se necessário)
        const colabIndex = this.colaboradores.findIndex(c => c.id === this.gerenteSelecionado);
        if (colabIndex !== -1) {
            this.colaboradores[colabIndex].isGerente = true;
            this.colaboradores[colabIndex].idDepartamento = this.departamentoAtual.id;
        }

        this.salvarNoStorage();
        localStorage.setItem('colaboradores', JSON.stringify(this.colaboradores));
        
        // Atualizar view
        this.departamentoAtual.idGerente = this.gerenteSelecionado;
        this.carregarViewDepartamento();
        this.fecharModalGerente();
        
        this.mostrarMensagem('Gerente atribuído com sucesso!', 'success');
    }

    // CARREGAR CARGOS NA VIEW
    static carregarCargosView() {
        const container = document.getElementById('dt-lista-cargos');
        const cargosDoDepartamento = this.cargos.filter(c => c.idDepartamento === this.departamentoAtual.id);
        
        container.innerHTML = '';
        
        if (cargosDoDepartamento.length === 0) {
            container.innerHTML = '<p class="sem-registros">Nenhum cargo cadastrado neste departamento.</p>';
            return;
        }
        
        cargosDoDepartamento.forEach(cargo => {
            const item = document.createElement('div');
            item.className = 'item-cargo';
            item.innerHTML = `
                <h4>${cargo.nome}</h4>
                ${cargo.descricao ? `<p>${cargo.descricao}</p>` : ''}
                <div class="acoes-cargo">
                    <button class="btn-small" onclick="DT_Departamentos.editarCargo(${cargo.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-excluir" onclick="DT_Departamentos.excluirCargo(${cargo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(item);
        });
    }

    // CARREGAR COLABORADORES NA VIEW
    static carregarColaboradoresView() {
        const tbody = document.getElementById('dt-lista-colaboradores');
        const colaboradoresDoDepto = this.colaboradores.filter(c => 
            (this.departamentoAtual.colaboradores || []).includes(c.id)
        );
        
        tbody.innerHTML = '';
        
        if (colaboradoresDoDepto.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="sem-registros">
                        Nenhum colaborador neste departamento.
                    </td>
                </tr>
            `;
            return;
        }
        
        colaboradoresDoDepto.forEach(colab => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${colab.nome}</td>
                <td>${colab.cargo || 'Não informado'}</td>
                <td>${this.formatarData(colab.dataAdmissao)}</td>
                <td><span class="status-badge status-${colab.status || 'ativo'}">${colab.status || 'Ativo'}</span></td>
                <td>
                    <button class="btn-small" onclick="DT_Departamentos.visualizarColaborador(${colab.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // FORMATAR DATA
    static formatarData(dataString) {
        if (!dataString) return 'Não informada';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }

    // VISUALIZAR COLABORADOR
    static visualizarColaborador(colabId) {
        const colaborador = this.colaboradores.find(c => c.id === colabId);
        if (!colaborador) return;

        // Preencher dados
        document.getElementById('dt-colab-nome').textContent = colaborador.nome;
        document.getElementById('dt-colab-nome-completo').textContent = colaborador.nome;
        document.getElementById('dt-colab-cargo').textContent = colaborador.cargo || 'Não informado';
        
        const depto = this.departamentos.find(d => d.id === colaborador.idDepartamento);
        document.getElementById('dt-colab-departamento').textContent = depto ? depto.nome : 'Não atribuído';
        
        document.getElementById('dt-colab-matricula').textContent = colaborador.matricula || 'N/A';
        document.getElementById('dt-colab-admissao').textContent = this.formatarData(colaborador.dataAdmissao);
        document.getElementById('dt-colab-cpf').textContent = colaborador.cpf || 'Não informado';
        document.getElementById('dt-colab-nascimento').textContent = this.formatarData(colaborador.dataNascimento);
        document.getElementById('dt-colab-estado-civil').textContent = colaborador.estadoCivil || 'Não informado';
        document.getElementById('dt-colab-email').textContent = colaborador.email || 'Não informado';
        document.getElementById('dt-colab-telefone').textContent = colaborador.telefone || 'Não informado';
        document.getElementById('dt-colab-salario').textContent = colaborador.salario ? `R$ ${parseFloat(colaborador.salario).toFixed(2)}` : 'Não informado';
        document.getElementById('dt-colab-regime').textContent = colaborador.regime || 'Não informado';
        document.getElementById('dt-colab-jornada').textContent = colaborador.jornada || 'Não informado';
        document.getElementById('dt-colab-endereco').textContent = colaborador.endereco || 'Não informado';
        document.getElementById('dt-colab-cidade-uf').textContent = colaborador.cidade ? `${colaborador.cidade}/${colaborador.uf}` : 'Não informado';

        // Mostrar tela
        document.getElementById('dt-view-screen').style.display = 'none';
        document.getElementById('dt-view-colaborador-screen').style.display = 'block';
    }

    // VOLTAR PARA DEPARTAMENTO
    static voltarParaDepartamento() {
        document.getElementById('dt-view-colaborador-screen').style.display = 'none';
        document.getElementById('dt-view-screen').style.display = 'block';
    }

    // MODAL DE CARGOS
    static abrirModalCargo() {
        document.getElementById('dt-modal-cargo-titulo').textContent = 'Novo Cargo';
        document.getElementById('dt-cargo-nome').value = '';
        document.getElementById('dt-cargo-descricao').value = '';
        
        document.getElementById('dt-modal-cargo').style.display = 'flex';
    }

    static fecharModalCargo() {
        document.getElementById('dt-modal-cargo').style.display = 'none';
    }

    static salvarCargo() {
        const nome = document.getElementById('dt-cargo-nome').value.trim();
        const descricao = document.getElementById('dt-cargo-descricao').value.trim();

        if (!nome) {
            alert('Informe o nome do cargo!');
            return;
        }

        const novoCargo = {
            id: this.gerarNovoId(this.cargos),
            nome,
            descricao,
            idDepartamento: this.departamentoAtual.id
        };

        this.cargos.push(novoCargo);
        this.salvarNoStorage();
        
        this.carregarCargosView();
        this.fecharModalCargo();
        
        this.mostrarMensagem('Cargo salvo com sucesso!', 'success');
    }

    static excluirCargo(cargoId) {
        if (!confirm('Excluir este cargo?')) return;
        
        this.cargos = this.cargos.filter(c => c.id !== cargoId);
        this.salvarNoStorage();
        
        this.carregarCargosView();
        this.mostrarMensagem('Cargo excluído!', 'success');
    }

    // MENSAGENS
    static mostrarMensagem(mensagem, tipo = 'info') {
        // Você pode implementar um sistema de toast/mensagens
        alert(mensagem); // Simplificado por enquanto
    }
}

// INICIALIZAR QUANDO A TELA FOR CARREGADA
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar departamentos
    DT_Departamentos.init();
    
    // Carregar grid inicial
    DT_Departamentos.carregarGrid();
    
    // Configurar busca na aba colaboradores
    const buscaInput = document.getElementById('dt-busca-colab');
    if (buscaInput) {
        buscaInput.addEventListener('input', function() {
            DT_Departamentos.filtrarColaboradores();
        });
    }
    
    // Configurar filtros
    const filtroMes = document.getElementById('dt-filtro-mes');
    const filtroAno = document.getElementById('dt-filtro-ano');
    const filtroOrdem = document.getElementById('dt-filtro-ordem');
    
    if (filtroMes) filtroMes.addEventListener('change', () => DT_Departamentos.filtrarColaboradores());
    if (filtroAno) filtroAno.addEventListener('change', () => DT_Departamentos.filtrarColaboradores());
    if (filtroOrdem) filtroOrdem.addEventListener('change', () => DT_Departamentos.filtrarColaboradores());
});

// Função de filtro de colaboradores (simplificada)
DT_Departamentos.filtrarColaboradores = function() {
    // Implementar filtros conforme necessário
    this.carregarColaboradoresView();
};