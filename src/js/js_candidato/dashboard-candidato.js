// dashboard-candidato.js

document.addEventListener("DOMContentLoaded", () => {
    // Elementos de navegação
    const vagasBtn = document.getElementById("vagas-btn");
    const candidaturasBtn = document.getElementById("candidaturas-btn");
    const perfilBtn = document.getElementById("perfil-btn");
    
    // Botões de voltar
    const voltarDashboardVagas = document.getElementById("voltar-dashboard-vagas");
    const voltarVagas = document.getElementById("voltar-vagas");
    const voltarDashboardCandidaturas = document.getElementById("voltar-dashboard-candidaturas");
    const explorarVagasFromEmpty = document.getElementById("explorar-vagas-from-empty");
    
    // Todas as screens
    const screens = {
        dashboard: document.getElementById("dashboard-screen"),
        vagas: document.getElementById("vagas-screen"),
        departamento: document.getElementById("departamento-screen"),
        candidaturas: document.getElementById("candidaturas-screen"),
        perfil: document.getElementById("perfil-screen")
    };
    
    // Estado atual
    let currentScreen = 'dashboard';
    let currentDepartamentoId = null;
    
    // Função para mostrar uma screen específica
    function showScreen(screenName) {
        // Esconde todas as screens
        Object.values(screens).forEach(screen => {
            if (screen) {
                screen.style.display = "none";
                screen.classList.remove("active");
            }
        });
        
        // Mostra a screen solicitada
        if (screens[screenName]) {
            screens[screenName].style.display = "flex";
            screens[screenName].classList.add("active");
            currentScreen = screenName;
            
            // Scroll para o topo
            window.scrollTo(0, 0);
            
            // Dispara evento customizado
            window.dispatchEvent(new CustomEvent('screenChanged', { 
                detail: { screen: screenName } 
            }));
        }
    }
    
    // Navegação principal
    vagasBtn?.addEventListener("click", () => {
        showScreen("vagas");
        // Carrega os departamentos (função do vagas-candidato.js)
        if (typeof loadDepartamentos === 'function') {
            loadDepartamentos();
        }
    });
    
    candidaturasBtn?.addEventListener("click", () => {
        showScreen("candidaturas");
        // Carrega as candidaturas (função do candidaturas-candidato.js)
        if (typeof loadCandidaturas === 'function') {
            loadCandidaturas();
        }
    });
    
    perfilBtn?.addEventListener("click", () => {
        showScreen("perfil");
        // Carrega o perfil (função do perfil.js)
        if (typeof loadPerfil === 'function') {
            loadPerfil();
        }
    });
    
    // Botões de voltar
    voltarDashboardVagas?.addEventListener("click", () => {
        showScreen("dashboard");
    });
    
    voltarVagas?.addEventListener("click", () => {
        showScreen("vagas");
        if (typeof loadDepartamentos === 'function') {
            loadDepartamentos();
        }
    });
    
    voltarDashboardCandidaturas?.addEventListener("click", () => {
        showScreen("dashboard");
    });
    
    explorarVagasFromEmpty?.addEventListener("click", () => {
        showScreen("vagas");
        if (typeof loadDepartamentos === 'function') {
            loadDepartamentos();
        }
    });
    
    // Função para ir para a tela de departamento
    window.goToDepartamento = (departamentoId, departamentoNome, departamentoDescricao) => {
        currentDepartamentoId = departamentoId;
        showScreen("departamento");
        
        // Atualiza informações do departamento
        const nomeElement = document.getElementById("nome-departamento");
        const descElement = document.getElementById("descricao-departamento");
        
        if (nomeElement) nomeElement.textContent = departamentoNome;
        if (descElement) descElement.textContent = departamentoDescricao;
        
        // Carrega as vagas do departamento
        if (typeof loadVagasDepartamento === 'function') {
            loadVagasDepartamento(departamentoId);
        }
    };
    
    // Inicializa com a dashboard visível
    showScreen("dashboard");
    
    // Exporta funções para uso em outros arquivos
    window.showScreen = showScreen;
    window.getCurrentScreen = () => currentScreen;
    window.getCurrentDepartamentoId = () => currentDepartamentoId;
    
    console.log("Dashboard Candidato inicializado!");
});