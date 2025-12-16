const dadosFolhaPagamento = [
    {
        id_colaborador: 1,
        nome: "Ana Carolina Lima", 
        cargo: "Analista de Recursos Humanos",
        status_pagamento: "Emitido",
        foto_url: "assets/perfis/ana_carolina.jpg",
        cpf: "123.456.789-00",
        // Dados Detalhados para o Contracheque
        contracheque: {
            cnpj: "12.345.678/0001-90",
            registro: "12345",
            salario_base: 4500.00,
            fgts_mes: 360.00,
            base_irrf: 4500.00,
            base_inss: 4500.00,
            lancamentos: [
                { rubrica: "Salário Base", tipo: "Provento", valor: 4500.00 },
                { rubrica: "Adicional Noturno", tipo: "Provento", valor: 250.00 },
                { rubrica: "INSS", tipo: "Desconto", valor: 495.00 },
                { rubrica: "IRRF", tipo: "Desconto", valor: 300.00 },
                { rubrica: "Vale Transporte", tipo: "Desconto", valor: 150.00 },
                { rubrica: "Plano de Saúde", tipo: "Desconto", valor: 100.00 },
            ]
        }
    },
    {
        id_colaborador: 2,
        nome: "Carlos Henrique Costa", 
        cargo: "Desenvolvedor Web Sênior",
        status_pagamento: "Pendente",
        foto_url: "assets/perfis/carlos_henrique.jpg",
        cpf: "987.654.321-00",
        contracheque: {
            cnpj: "12.345.678/0001-90",
            registro: "54321",
            salario_base: 8000.00,
            fgts_mes: 640.00,
            base_irrf: 8000.00,
            base_inss: 8000.00,
            lancamentos: [
                { rubrica: "Salário Base", tipo: "Provento", valor: 8000.00 },
                { rubrica: "Gratificação", tipo: "Provento", valor: 500.00 },
                { rubrica: "INSS", tipo: "Desconto", valor: 876.75 },
                { rubrica: "IRRF", tipo: "Desconto", valor: 1200.00 },
                { rubrica: "Plano de Saúde", tipo: "Desconto", valor: 250.00 },
            ]
        }
    },
    {
        id_colaborador: 3,
        nome: "Fernanda Rocha Alves", 
        cargo: "Gerente de Projetos",
        status_pagamento: "Emitido",
        foto_url: "assets/perfis/fernanda.jpg", 
        cpf: "456.789.123-00",
        contracheque: {
            cnpj: "12.345.678/0001-90",
            registro: "98765",
            salario_base: 6000.00,
            fgts_mes: 480.00,
            base_irrf: 6000.00,
            base_inss: 6000.00,
            lancamentos: [
                { rubrica: "Salário Base", tipo: "Provento", valor: 6000.00 },
                { rubrica: "Horas Extras 50%", tipo: "Provento", valor: 300.00 },
                { rubrica: "INSS", tipo: "Desconto", valor: 660.00 },
                { rubrica: "IRRF", tipo: "Desconto", valor: 650.00 },
            ]
        }
    },
    {
        id_colaborador: 4,
        nome: "João Pedro Souza", 
        cargo: "Marketing Digital",
        status_pagamento: "Pendente",
        foto_url: "assets/perfis/joao_pedro.jpg",
        cpf: "321.654.987-00",
        contracheque: {
            cnpj: "12.345.678/0001-90",
            registro: "11223",
            salario_base: 3000.00,
            fgts_mes: 240.00,
            base_irrf: 3000.00,
            base_inss: 3000.00,
            lancamentos: [
                { rubrica: "Salário Base", tipo: "Provento", valor: 3000.00 },
                { rubrica: "Vale Transporte", tipo: "Desconto", valor: 180.00 },
                { rubrica: "INSS", tipo: "Desconto", valor: 330.00 },
            ]
        }
    },
    {
        id_colaborador: 5,
        nome: "Mariana Silva Gomes", 
        cargo: "Analista Financeiro",
        status_pagamento: "Emitido",
        foto_url: "assets/perfis/mariana.jpg",
        cpf: "654.321.987-00",
        contracheque: {
            cnpj: "12.345.678/0001-90",
            registro: "44556",
            salario_base: 5000.00,
            fgts_mes: 400.00,
            base_irrf: 5000.00,
            base_inss: 5000.00,
            lancamentos: [
                { rubrica: "Salário Base", tipo: "Provento", valor: 5000.00 },
                { rubrica: "Adicional Periculosidade", tipo: "Provento", valor: 1500.00 },
                { rubrica: "INSS", tipo: "Desconto", valor: 735.00 },
                { rubrica: "IRRF", tipo: "Desconto", valor: 500.00 },
                { rubrica: "Faltas", tipo: "Desconto", valor: 200.00 },
            ]
        }
    },
];

// FUNÇÕES AUXILIARES PARA MODAIS
function abrirModal(idModal, mensagem) {
    const modal = document.getElementById(idModal);
    if (modal) {
        if (idModal === 'modal-sucesso') {
            document.getElementById('modal-sucesso-mensagem').textContent = mensagem;
        }
        modal.style.display = 'flex';
    }
}

function fecharModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Função auxiliar para formatar moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor);
}

// Função que cria o card HTML (inalterada)
function criarColaboradorCard(colaborador) {
    const { id_colaborador, nome, cargo, status_pagamento, foto_url } = colaborador;

    const isPendente = status_pagamento === "Pendente";
    const statusPendenteChecked = isPendente ? "checked" : "";
    const statusEmitidoChecked = !isPendente ? "checked" : "";

    const idNomeLower = nome.replace(/\s/g, '').toLowerCase(); 
    const radioGroupName = `status-${idNomeLower}-${id_colaborador}`;
    const id_pendente = `pendente-${radioGroupName}`;
    const id_emitido = `emitido-${radioGroupName}`;

    return `
        <div class="div-de-organizacao" data-colab-id="${id_colaborador}">
            <div class="colaborador-card">
                <div class="fp-perfil-info">
                    <div class="fp-profile-pic">
                        <img src="${foto_url}" alt="Foto de Perfil de ${nome}">
                    </div>
                    <div class="fp-textos">
                        <p class="fp-nome">${nome}</p>
                        <p class="fp-cargo">${cargo}</p>
                    </div>
                </div>

                <div class="fp-botoes-acao">
                    <button class="btn-defaunt download" onclick="gerarFolha(${id_colaborador}, '${nome}')">
                        <i class="fas fa-download"></i> Gerar folha de pagamento
                    </button>
                    <button class="btn-defaunt view" onclick="verFolha(${id_colaborador}, '${nome}')">
                        <i class="fas fa-eye"></i> Ver folha de pagamento
                    </button>
                </div>

                <div class="fp-status-pagamento">
                    <p class="fp-status-titulo">Status de pagamento</p>
                    <div class="fp-status-lista">
                        <div class="fp-status-item">
                            <input
                                type="radio"
                                name="${radioGroupName}"
                                id="${id_pendente}"
                                ${statusPendenteChecked}
                                disabled
                            />
                            <label for="${id_pendente}" class="status-pendente"
                                >Pendente</label
                            >
                        </div>
                        <div class="fp-status-item">
                            <input
                                type="radio"
                                name="${radioGroupName}"
                                id="${id_emitido}"
                                ${statusEmitidoChecked}
                                disabled
                            />
                            <label for="${id_emitido}" class="status-emitido"
                                >Emitido</label
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderizarColaboradores(dados) {
    const container = document.getElementById('container');
    if (!container) return;
    container.innerHTML = dados.map(criarColaboradorCard).join('');
}

// 💥 ALTERADA: Usa Modal de Sucesso em vez de alert
function gerarFolha(id, nome) {
    console.log(`[AÇÃO BACK] Tentativa de geração e emissão para: ${nome} (ID: ${id})`);
    
    const colaboradorIndex = dadosFolhaPagamento.findIndex(c => c.id_colaborador === id);

    if (colaboradorIndex !== -1) {
        dadosFolhaPagamento[colaboradorIndex].status_pagamento = "Emitido";
        
        renderizarColaboradores(dadosFolhaPagamento);
        
        // NOVO: Chama o Modal de Sucesso
        abrirModal('modal-sucesso', `Folha de pagamento de ${nome} gerada e status definido como EMITIDO.`);
        
    } else {
        // Mantido o alert para erro, mas idealmente seria um modal de erro
        alert(`❌ Erro: Colaborador ${nome} não encontrado.`);
    }
}

// 💥 ALTERADA: Implementa a lógica de injeção de dados detalhados
function verFolha(id, nome) {
    console.log(`[AÇÃO FRONT] Abrir modal de contracheque para: ${nome} (ID: ${id})`);
    
    const colaborador = dadosFolhaPagamento.find(c => c.id_colaborador === id);
    
    if (colaborador && colaborador.contracheque) {
        const { contracheque } = colaborador;
        
        // 1. Injeta os dados do colaborador e empresa
        document.getElementById('contracheque-titulo').textContent = `Contracheque de ${nome}`;
        
        // Dados da Empresa e Funcionário
        document.getElementById('nome-detalhe').textContent = nome;
        document.getElementById('cargo-detalhe').textContent = colaborador.cargo;
        document.getElementById('cpf').textContent = colaborador.cpf;
        document.getElementById('cnpj').textContent = contracheque.cnpj;
        document.getElementById('registro-detalhe').textContent = contracheque.registro;

        // 2. Calcula Totais e Renderiza Lançamentos
        let totalProventos = 0;
        let totalDescontos = 0;
        const tabelaLancamentos = document.getElementById('tabela-lancamentos');
        tabelaLancamentos.innerHTML = ''; // Limpa lançamentos anteriores

        contracheque.lancamentos.forEach(lancamento => {
            const isProvento = lancamento.tipo === 'Provento';
            const valor = lancamento.valor;

            if (isProvento) {
                totalProventos += valor;
            } else {
                totalDescontos += valor;
            }

            const row = tabelaLancamentos.insertRow();
            row.innerHTML = `
                <td>${lancamento.rubrica}</td>
                <td class="valor-provento">${isProvento ? formatarMoeda(valor) : '-'}</td>
                <td class="valor-desconto">${!isProvento ? formatarMoeda(valor) : '-'}</td>
            `;
        });

        const salarioLiquido = totalProventos - totalDescontos;

        // 3. Injeta Totais e Resumo Financeiro
        document.getElementById('total-proventos').textContent = formatarMoeda(totalProventos);
        document.getElementById('total-descontos-tabela').textContent = formatarMoeda(totalDescontos);

        document.getElementById('salario-bruto').textContent = formatarMoeda(totalProventos);
        document.getElementById('total-descontos').textContent = formatarMoeda(totalDescontos);
        document.getElementById('salario-liquido').textContent = formatarMoeda(salarioLiquido);

        // 4. Injeta Detalhes Finais
        document.getElementById('fgts-mes').textContent = formatarMoeda(contracheque.fgts_mes);
        document.getElementById('base-irrf').textContent = formatarMoeda(contracheque.base_irrf);
        document.getElementById('base-inss').textContent = formatarMoeda(contracheque.base_inss);
        
        // 5. Abre o Modal
        abrirModal('modal-contracheque');
    } else {
        alert(`❌ Erro: Dados de contracheque para ${nome} não encontrados.`);
    }
}

function configurarFiltroFolhaPagamento() {
    const searchInput = document.getElementById('search');

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const termoBusca = event.target.value.toLowerCase().trim();
            
            const resultadosFiltrados = dadosFolhaPagamento.filter(colaborador => 
                colaborador.nome.toLowerCase().includes(termoBusca) || 
                colaborador.cargo.toLowerCase().includes(termoBusca)
            );

            renderizarColaboradores(resultadosFiltrados);
        });
    }

    renderizarColaboradores(dadosFolhaPagamento);
    
    const exportButton = document.querySelector('.acoes-globais-folha .btn-defaunt');
    if (exportButton) {
        exportButton.onclick = exportarRelatorio;
    }
}

function exportarRelatorio() {
    console.log('Ação: Exportando relatório mensal de Folha de Pagamento.');
    // Mantido como alert por ser ação secundária, mas pode ser trocado por um modal de progresso
    alert('Exportando relatório mensal.'); 
}

document.addEventListener('DOMContentLoaded', configurarFiltroFolhaPagamento);