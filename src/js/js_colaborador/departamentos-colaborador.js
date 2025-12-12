// departamentos-colaborador.js

// Dados simulados (substituir por chamadas API reais)
const DEPARTAMENTO_MOCK = {
    id_departamento: 1,
    nome: "Tecnologia da Informação",
    sigla: "TI",
    localizacao: "Bloco A, Sala 201 - Andar 2",
    telefone: "(11) 98765-4321",
    status: "ATIVO",
    descricao: "Departamento responsável pela infraestrutura tecnológica da empresa"
};

const CARGO_MOCK = {
    id_cargo: 1,
    titulo: "Desenvolvedor Full Stack",
    descricao: "Desenvolvimento e manutenção de sistemas internos"
};

const GERENTE_MOCK = {
    id_usuario: 2,
    nome: "Carlos Silva",
    email: "carlos.silva@empresa.com",
    telefone: "(11) 99876-5432",
    foto: "/src/assets/imgs/default-avatar.png",
    cargo: "Gerente de TI"
};

let departamentoData = null;
let gerenteData = null;
let cargoData = null;

// Função principal para carregar dados do departamento
async function carregarDepartamentoColaborador() {
    try {
        mostrarLoading(true);
        
        // Simulando delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Aqui você faria a chamada para sua API real
        // Exemplo: 
        // const response = await fetch('/api/colaborador/departamento');
        // const data = await response.json();
        // departamentoData = data.departamento;
        // cargoData = data.cargo;
        // gerenteData = data.gerente;
        
        // Usando dados mockados por enquanto
        departamentoData = DEPARTAMENTO_MOCK;
        cargoData = CARGO_MOCK;
        gerenteData = GERENTE_MOCK;
        
        // Atualizar a interface
        atualizarInterfaceDepartamento();
        
        mostrarLoading(false);
        
    } catch (error) {
        console.error('Erro ao carregar departamento:', error);
        mostrarMensagemErro();
        mostrarLoading(false);
    }
}

// Atualizar interface com os dados
function atualizarInterfaceDepartamento() {
    if (!departamentoData || !cargoData || !gerenteData) return;
    
    // Informações do departamento
    document.getElementById('departamento-nome').textContent = departamentoData.nome;
    document.getElementById('departamento-sigla').textContent = departamentoData.sigla;
    document.getElementById('departamento-localizacao').textContent = departamentoData.localizacao;
    document.getElementById('departamento-telefone').textContent = departamentoData.telefone;
    document.getElementById('departamento-status').textContent = departamentoData.status;
    
    // Cargo do colaborador
    document.getElementById('colaborador-cargo').textContent = cargoData.titulo;
    
    // Informações do gerente
    document.getElementById('gerente-nome').textContent = gerenteData.nome;
    document.getElementById('gerente-email').textContent = gerenteData.email;
    document.getElementById('gerente-telefone').textContent = gerenteData.telefone;
    
    const gerenteFoto = document.getElementById('gerente-foto');
    if (gerenteData.foto) {
        gerenteFoto.src = gerenteData.foto;
        gerenteFoto.onerror = function() {
            this.src = '/src/assets/imgs/default-avatar.png';
        };
    }
}

// Mostrar/ocultar loading
function mostrarLoading(mostrar) {
    const container = document.querySelector('.departamento-container');
    const botoes = document.querySelectorAll('button');
    
    if (mostrar) {
        container.classList.add('loading');
        botoes.forEach(btn => btn.disabled = true);
        
        // Mostrar placeholders de loading
        document.getElementById('departamento-nome').textContent = 'Carregando...';
        document.getElementById('departamento-localizacao').textContent = 'Carregando...';
        document.getElementById('colaborador-cargo').textContent = 'Carregando...';
        document.getElementById('departamento-telefone').textContent = 'Carregando...';
        document.getElementById('gerente-nome').textContent = 'Carregando...';
        document.getElementById('gerente-email').textContent = 'carregando...';
        document.getElementById('gerente-telefone').textContent = 'carregando...';
    } else {
        container.classList.remove('loading');
        botoes.forEach(btn => btn.disabled = false);
    }
}

// Mostrar mensagem de erro
function mostrarMensagemErro() {
    const container = document.querySelector('.departamento-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f0912f; margin-bottom: 20px;"></i>
            <h2 style="color: #333; margin-bottom: 15px;">Erro ao carregar informações</h2>
            <p style="color: #666; margin-bottom: 30px;">Não foi possível carregar as informações do departamento. Tente novamente mais tarde.</p>
            <button class="btn-defaunt" onclick="recarregarDepartamento()">
                <i class="fas fa-redo"></i> Tentar Novamente
            </button>
        </div>
    `;
}

function recarregarDepartamento() {
    carregarDepartamentoColaborador();
}

// Modal de Suporte
function abrirModalSuporte() {
    const modal = document.getElementById('modalSuporte');
    modal.style.display = 'flex';
    
    // Limpar campos
    document.getElementById('suporte-assunto').value = '';
    document.getElementById('suporte-tipo').value = '';
    document.getElementById('suporte-mensagem').value = '';
    
    // Foco no primeiro campo
    setTimeout(() => {
        document.getElementById('suporte-assunto').focus();
    }, 100);
}

function fecharModalSuporte() {
    const modal = document.getElementById('modalSuporte');
    modal.style.display = 'none';
}

async function enviarSolicitacaoSuporte() {
    const assunto = document.getElementById('suporte-assunto').value.trim();
    const tipo = document.getElementById('suporte-tipo').value;
    const mensagem = document.getElementById('suporte-mensagem').value.trim();
    
    // Validação
    if (!assunto || !tipo || !mensagem) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    if (mensagem.length < 10) {
        alert('Por favor, forneça uma descrição mais detalhada (mínimo 10 caracteres).');
        return;
    }
    
    try {
        // Mostrar loading no botão
        const btnEnviar = document.querySelector('.btn-suporte-enviar');
        const originalText = btnEnviar.innerHTML;
        btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btnEnviar.disabled = true;
        
        // Simular envio (substituir por API real)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Aqui você faria a requisição real:
        /*
        const response = await fetch('/api/suporte/enviar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                assunto,
                tipo,
                mensagem,
                departamento_id: departamentoData.id_departamento,
                departamento_nome: departamentoData.nome
            })
        });
        
        if (!response.ok) throw new Error('Erro ao enviar solicitação');
        */
        
        // Log para debug
        console.log('Solicitação de suporte enviada:', {
            assunto,
            tipo,
            mensagem,
            departamento: departamentoData.nome,
            data: new Date().toISOString()
        });
        
        // Fechar modal e mostrar notificação
        fecharModalSuporte();
        mostrarNotificacaoSucesso();
        
        // Restaurar botão
        btnEnviar.innerHTML = originalText;
        btnEnviar.disabled = false;
        
    } catch (error) {
        console.error('Erro ao enviar solicitação:', error);
        alert('Erro ao enviar solicitação. Tente novamente.');
        
        // Restaurar botão em caso de erro
        const btnEnviar = document.querySelector('.btn-suporte-enviar');
        btnEnviar.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
        btnEnviar.disabled = false;
    }
}

function mostrarNotificacaoSucesso() {
    // Remover notificação anterior se existir
    const notificacaoAnterior = document.querySelector('.sucesso-notificacao');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = 'sucesso-notificacao';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 4.7s forwards;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 20px;"></i>
        <div>
            <strong>Solicitação enviada!</strong>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Recebemos sua solicitação e responderemos em breve.</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Adicionar estilos CSS dinamicamente
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modalSuporte');
        if (event.target === modal) {
            fecharModalSuporte();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('modalSuporte');
            if (modal.style.display === 'flex') {
                fecharModalSuporte();
            }
        }
    });
    
    // Auto-carregar quando a tela for exibida
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const tela = document.getElementById('departamentos-screen');
                if (tela && tela.style.display !== 'none') {
                    // Pequeno delay para garantir que a transição terminou
                    setTimeout(() => {
                        carregarDepartamentoColaborador();
                    }, 100);
                }
            }
        });
    });
    
    const telaDepartamentos = document.getElementById('departamentos-screen');
    if (telaDepartamentos) {
        observer.observe(telaDepartamentos, { attributes: true });
    }
});

// Exportar funções para uso global
window.carregarDepartamentoColaborador = carregarDepartamentoColaborador;
window.abrirModalSuporte = abrirModalSuporte;
window.fecharModalSuporte = fecharModalSuporte;
window.enviarSolicitacaoSuporte = enviarSolicitacaoSuporte;
window.recarregarDepartamento = recarregarDepartamento;