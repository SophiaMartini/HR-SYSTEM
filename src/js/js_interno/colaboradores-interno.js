// Dados de exemplo para colaboradores
let colaboradoresData = [
    {
        id: 1,
        nome: "João Silva",
        cpf: "123.456.789-00",
        cargo: "Desenvolvedor Front-end",
        departamento: "TI",
        dataAdmissao: "15/03/2022",
        status: "ativo",
        telefone: "(11) 99999-9999",
        email: "joao.silva@empresa.com",
        salario: 5500.00,
        matricula: "001234",
        dataNascimento: "10/05/1990",
        rg: "12.345.678-9",
        estadoCivil: "Casado",
        genero: "Masculino",
        endereco: {
            rua: "Rua das Flores",
            numero: "123",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01234-567"
        }
    },
    {
        id: 2,
        nome: "Maria Santos",
        cpf: "987.654.321-00",
        cargo: "Analista de RH",
        departamento: "RH",
        dataAdmissao: "20/06/2021",
        status: "ativo",
        telefone: "(11) 98888-8888",
        email: "maria.santos@empresa.com",
        salario: 4500.00,
        matricula: "001235",
        dataNascimento: "25/08/1985",
        rg: "98.765.432-1",
        estadoCivil: "Solteira",
        genero: "Feminino",
        endereco: {
            rua: "Av. Paulista",
            numero: "1000",
            bairro: "Bela Vista",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01310-100"
        }
    },
    {
        id: 3,
        nome: "Carlos Oliveira",
        cpf: "456.789.123-00",
        cargo: "Gerente de Projetos",
        departamento: "TI",
        dataAdmissao: "10/01/2020",
        status: "ativo",
        telefone: "(11) 97777-7777",
        email: "carlos.oliveira@empresa.com",
        salario: 8500.00,
        matricula: "001236",
        dataNascimento: "15/12/1978",
        rg: "45.678.912-3",
        estadoCivil: "Casado",
        genero: "Masculino",
        endereco: {
            rua: "Rua das Palmeiras",
            numero: "45",
            bairro: "Jardins",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01414-000"
        }
    },
    {
        id: 4,
        nome: "Ana Costa",
        cpf: "789.123.456-00",
        cargo: "Contadora",
        departamento: "Financeiro",
        dataAdmissao: "05/09/2023",
        status: "afastado",
        telefone: "(11) 96666-6666",
        email: "ana.costa@empresa.com",
        salario: 6000.00,
        matricula: "001237",
        dataNascimento: "30/03/1992",
        rg: "78.912.345-6",
        estadoCivil: "Solteira",
        genero: "Feminino",
        endereco: {
            rua: "Rua das Acácias",
            numero: "78",
            bairro: "Moema",
            cidade: "São Paulo",
            estado: "SP",
            cep: "04076-000"
        }
    },
    {
        id: 5,
        nome: "Pedro Almeida",
        cpf: "321.654.987-00",
        cargo: "Designer Gráfico",
        departamento: "Marketing",
        dataAdmissao: "12/11/2022",
        status: "ferias",
        telefone: "(11) 95555-5555",
        email: "pedro.almeida@empresa.com",
        salario: 4000.00,
        matricula: "001238",
        dataNascimento: "20/07/1995",
        rg: "32.165.498-7",
        estadoCivil: "Solteiro",
        genero: "Masculino",
        endereco: {
            rua: "Rua das Magnólias",
            numero: "90",
            bairro: "Pinheiros",
            cidade: "São Paulo",
            estado: "SP",
            cep: "05422-000"
        }
    }
];

// Variáveis globais
let colaboradoresFiltrados = [...colaboradoresData];
let paginaAtual = 1;
const itensPorPagina = 10;
let colaboradorSelecionado = null;

// Inicialização quando a screen é carregada
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botão da dashboard
    const colaboradoresBtn = document.getElementById('colaboradores-btn');
    if (colaboradoresBtn) {
        colaboradoresBtn.addEventListener('click', function() {
            mostrarTela('colaboradores-screen');
            carregarColaboradores();
        });
    }

    // Configurar filtros
    const filtroBusca = document.getElementById('busca-colaborador');
    const filtroDepartamento = document.getElementById('filtro-departamento');
    const filtroOrdem = document.getElementById('filtro-ordem');
    const filtroStatus = document.getElementById('filtro-status');

    if (filtroBusca) filtroBusca.addEventListener('input', aplicarFiltros);
    if (filtroDepartamento) filtroDepartamento.addEventListener('change', aplicarFiltros);
    if (filtroOrdem) filtroOrdem.addEventListener('change', aplicarFiltros);
    if (filtroStatus) filtroStatus.addEventListener('change', aplicarFiltros);
});

// Função para carregar colaboradores
function carregarColaboradores() {
    aplicarFiltros();
    atualizarContadores();
}

// Aplicar filtros
function aplicarFiltros() {
    const termoBusca = document.getElementById('busca-colaborador').value.toLowerCase();
    const departamento = document.getElementById('filtro-departamento').value;
    const ordem = document.getElementById('filtro-ordem').value;
    const status = document.getElementById('filtro-status').value;

    // Filtrar colaboradores
    colaboradoresFiltrados = colaboradoresData.filter(colaborador => {
        // Busca
        const buscaMatch = !termoBusca || 
            colaborador.nome.toLowerCase().includes(termoBusca) ||
            colaborador.cpf.includes(termoBusca) ||
            colaborador.cargo.toLowerCase().includes(termoBusca) ||
            colaborador.matricula.toLowerCase().includes(termoBusca);

        // Departamento
        const departamentoMatch = !departamento || colaborador.departamento === departamento;
        
        // Status
        const statusMatch = !status || colaborador.status === status;

        return buscaMatch && departamentoMatch && statusMatch;
    });

    // Ordenar
    colaboradoresFiltrados.sort((a, b) => {
        switch (ordem) {
            case 'nome-az':
                return a.nome.localeCompare(b.nome);
            case 'nome-za':
                return b.nome.localeCompare(a.nome);
            case 'data-admissao-recente':
                return new Date(b.dataAdmissao.split('/').reverse().join('-')) - 
                       new Date(a.dataAdmissao.split('/').reverse().join('-'));
            case 'data-admissao-antiga':
                return new Date(a.dataAdmissao.split('/').reverse().join('-')) - 
                       new Date(b.dataAdmissao.split('/').reverse().join('-'));
            case 'cargo-az':
                return a.cargo.localeCompare(b.cargo);
            default:
                return 0;
        }
    });

    // Resetar para primeira página
    paginaAtual = 1;
    
    // Renderizar tabela
    renderizarTabelaColaboradores();
}

// Renderizar tabela de colaboradores
function renderizarTabelaColaboradores() {
    const tbody = document.getElementById('lista-colaboradores-body');
    const semResultados = document.getElementById('sem-colaboradores');
    
    if (!tbody) return;

    tbody.innerHTML = '';

    if (colaboradoresFiltrados.length === 0) {
        if (semResultados) semResultados.style.display = 'block';
        return;
    }

    if (semResultados) semResultados.style.display = 'none';

    // Calcular índices para paginação
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = Math.min(inicio + itensPorPagina, colaboradoresFiltrados.length);
    const colaboradoresPagina = colaboradoresFiltrados.slice(inicio, fim);

    // Adicionar colaboradores à tabela
    colaboradoresPagina.forEach(colaborador => {
        const tr = document.createElement('tr');
        
        // Mapear status para classes CSS
        let statusClass = '';
        let statusTexto = '';
        switch(colaborador.status) {
            case 'ativo':
                statusClass = 'status-ativo-tabela';
                statusTexto = 'Ativo';
                break;
            case 'afastado':
                statusClass = 'status-afastado-tabela';
                statusTexto = 'Afastado';
                break;
            case 'ferias':
                statusClass = 'status-ferias-tabela';
                statusTexto = 'Férias';
                break;
            case 'desligado':
                statusClass = 'status-desligado-tabela';
                statusTexto = 'Desligado';
                break;
        }

        tr.innerHTML = `
            <td>${colaborador.nome}</td>
            <td>${colaborador.cpf}</td>
            <td>${colaborador.cargo}</td>
            <td>${colaborador.departamento}</td>
            <td>${colaborador.dataAdmissao}</td>
            <td><span class="status-colaborador ${statusClass}">${statusTexto}</span></td>
            <td>
                <div class="acoes-tabela">
                    <button class="btn-acao ver" onclick="verDetalhesColaborador(${colaborador.id})" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-acao editar" onclick="editarColaborador(${colaborador.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-acao excluir" onclick="excluirColaborador(${colaborador.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });

    // Atualizar paginação
    atualizarPaginacaoColaboradores();
}

// Atualizar contadores
function atualizarContadores() {
    const total = colaboradoresFiltrados.length;
    const ativos = colaboradoresFiltrados.filter(c => c.status === 'ativo').length;
    const afastados = colaboradoresFiltrados.filter(c => c.status === 'afastado').length;
    const ferias = colaboradoresFiltrados.filter(c => c.status === 'ferias').length;

    document.getElementById('total-colaboradores').textContent = total;
    document.getElementById('count-ativos').textContent = ativos;
    document.getElementById('count-afastados').textContent = afastados;
    document.getElementById('count-ferias').textContent = ferias;
}

// Atualizar paginação
function atualizarPaginacaoColaboradores() {
    const totalPaginas = Math.ceil(colaboradoresFiltrados.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina + 1;
    const fim = Math.min(paginaAtual * itensPorPagina, colaboradoresFiltrados.length);

    // Atualizar informações
    document.getElementById('pagina-inicio').textContent = inicio;
    document.getElementById('pagina-fim').textContent = fim;
    document.getElementById('total-registros').textContent = colaboradoresFiltrados.length;

    // Atualizar números das páginas
    const numerosPagina = document.getElementById('numeros-pagina-colaboradores');
    if (!numerosPagina) return;

    numerosPagina.innerHTML = '';

    // Mostrar apenas algumas páginas próximas
    const inicioPaginas = Math.max(1, paginaAtual - 2);
    const fimPaginas = Math.min(totalPaginas, paginaAtual + 2);

    for (let i = inicioPaginas; i <= fimPaginas; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        if (i === paginaAtual) {
            span.classList.add('pagina-ativa');
        }
        span.addEventListener('click', () => {
            paginaAtual = i;
            renderizarTabelaColaboradores();
        });
        numerosPagina.appendChild(span);
    }
}

// Mudar página
function mudarPaginaColaboradores(direcao) {
    const totalPaginas = Math.ceil(colaboradoresFiltrados.length / itensPorPagina);
    const novaPagina = paginaAtual + direcao;

    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
        paginaAtual = novaPagina;
        renderizarTabelaColaboradores();
    }
}

// Limpar filtros
function limparFiltrosColaboradores() {
    document.getElementById('busca-colaborador').value = '';
    document.getElementById('filtro-departamento').value = '';
    document.getElementById('filtro-ordem').value = 'nome-az';
    document.getElementById('filtro-status').value = '';
    
    aplicarFiltros();
}

// Ver detalhes do colaborador
function verDetalhesColaborador(id) {
    colaboradorSelecionado = colaboradoresData.find(c => c.id === id);
    
    if (!colaboradorSelecionado) {
        alert('Colaborador não encontrado');
        return;
    }

    // Preencher informações básicas
    document.getElementById('colaborador-nome').textContent = colaboradorSelecionado.nome;
    document.getElementById('colaborador-cargo').textContent = colaboradorSelecionado.cargo;
    document.getElementById('colaborador-departamento').textContent = colaboradorSelecionado.departamento;
    document.getElementById('colaborador-matricula').textContent = colaboradorSelecionado.matricula;
    document.getElementById('colaborador-admissao').textContent = colaboradorSelecionado.dataAdmissao;

    // Atualizar status indicador
    const indicador = document.getElementById('colaborador-status-indicador');
    indicador.className = 'status-indicador';
    indicador.classList.add(colaboradorSelecionado.status);

    // Preencher aba de dados pessoais
    document.getElementById('info-nome-completo').textContent = colaboradorSelecionado.nome;
    document.getElementById('info-data-nascimento').textContent = colaboradorSelecionado.dataNascimento || 'Não informado';
    document.getElementById('info-cpf').textContent = colaboradorSelecionado.cpf;
    document.getElementById('info-rg').textContent = colaboradorSelecionado.rg || 'Não informado';
    document.getElementById('info-estado-civil').textContent = colaboradorSelecionado.estadoCivil || 'Não informado';
    document.getElementById('info-genero').textContent = colaboradorSelecionado.genero || 'Não informado';
    
    // Endereço
    if (colaboradorSelecionado.endereco) {
        document.getElementById('info-cep').textContent = colaboradorSelecionado.endereco.cep || 'Não informado';
        document.getElementById('info-logradouro').textContent = colaboradorSelecionado.endereco.rua || 'Não informado';
        document.getElementById('info-numero').textContent = colaboradorSelecionado.endereco.numero || 'Não informado';
        document.getElementById('info-complemento').textContent = colaboradorSelecionado.endereco.complemento || 'Não informado';
        document.getElementById('info-bairro').textContent = colaboradorSelecionado.endereco.bairro || 'Não informado';
        document.getElementById('info-cidade').textContent = colaboradorSelecionado.endereco.cidade || 'Não informado';
        document.getElementById('info-estado').textContent = colaboradorSelecionado.endereco.estado || 'Não informado';
    }

    // Preencher aba de dados profissionais
    document.getElementById('info-cargo').textContent = colaboradorSelecionado.cargo;
    document.getElementById('info-departamento').textContent = colaboradorSelecionado.departamento;
    document.getElementById('info-data-admissao').textContent = colaboradorSelecionado.dataAdmissao;
    document.getElementById('info-salario-base').textContent = colaboradorSelecionado.salario ? 
        `R$ ${colaboradorSelecionado.salario.toFixed(2)}` : 'Não informado';
    
    // Mapear status para texto
    let statusTexto = '';
    switch(colaboradorSelecionado.status) {
        case 'ativo': statusTexto = 'Ativo'; break;
        case 'afastado': statusTexto = 'Afastado'; break;
        case 'ferias': statusTexto = 'Férias'; break;
        case 'desligado': statusTexto = 'Desligado'; break;
    }
    document.getElementById('info-status-profissional').textContent = statusTexto;

    // Preencher aba de contato
    document.getElementById('info-email-corporativo').textContent = colaboradorSelecionado.email || 'Não informado';
    document.getElementById('info-celular').textContent = colaboradorSelecionado.telefone || 'Não informado';

    // Mostrar screen de detalhes
    mostrarTela('detalhes-colaborador-screen');
    mudarAbaColaborador('pessoal');
}

// Mudar aba nos detalhes do colaborador
function mudarAbaColaborador(aba) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.aba-colaborador').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.aba-conteudo-colaborador').forEach(content => {
        content.classList.remove('active');
    });

    // Adicionar active na aba selecionada
    document.querySelector(`.aba-colaborador[data-aba="${aba}"]`).classList.add('active');
    document.getElementById(`aba-${aba}`).classList.add('active');
}

// Voltar para lista de colaboradores
function voltarParaListaColaboradores() {
    mostrarTela('colaboradores-screen');
}

// Editar colaborador
function editarColaborador(id) {
    if (id) {
        colaboradorSelecionado = colaboradoresData.find(c => c.id === id);
    }
    
    if (!colaboradorSelecionado) {
        alert('Colaborador não encontrado');
        return;
    }

    // Preencher modal de edição
    document.getElementById('modal-colaborador-titulo').textContent = 'Editar Colaborador';
    
    // Aqui você implementaria a lógica para preencher o formulário
    // com os dados do colaboradorSelecionado
    
    // Mostrar modal
    document.getElementById('modal-colaborador').style.display = 'block';
}

document.getElementById('colaboradores-btn').addEventListener('click', function() {
    mostrarTela('colaboradores-screen');
    carregarColaboradores();
});


// Excluir colaborador
function excluirColaborador(id) {
    if (!confirm('Tem certeza que deseja excluir este colaborador?')) {
        return;
    }

    const index = colaboradoresData.findIndex(c => c.id === id);
    if (index !== -1) {
        colaboradoresData.splice(index, 1);
        carregarColaboradores();
        alert('Colaborador excluído com sucesso!');
    }
}

// Exportar lista de colaboradores
function exportarColaboradores() {
    // Simulação de exportação
    const dados = colaboradoresFiltrados.map(c => ({
        Nome: c.nome,
        CPF: c.cpf,
        Cargo: c.cargo,
        Departamento: c.departamento,
        'Data Admissão': c.dataAdmissao,
        Status: c.status,
        Telefone: c.telefone,
        Email: c.email
    }));

    console.log('Dados para exportação:', dados);
    alert('Lista de colaboradores exportada com sucesso!');
}

// Exportar dados do colaborador
function exportarDadosColaborador() {
    if (!colaboradorSelecionado) return;
    
    // Simulação de exportação
    console.log('Exportando dados de:', colaboradorSelecionado.nome);
    alert(`Dados de ${colaboradorSelecionado.nome} exportados com sucesso!`);
}

// Adicionar documento
function adicionarDocumento() {
    alert('Funcionalidade de adicionar documento em desenvolvimento');
}

// Adicionar dependente
function adicionarDependente() {
    alert('Funcionalidade de adicionar dependente em desenvolvimento');
}

// Função auxiliar para mostrar telas
function mostrarTela(idTela) {
    // Esconder todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    
    // Mostrar a tela solicitada
    const tela = document.getElementById(idTela);
    if (tela) {
        tela.style.display = 'block';
    }
}