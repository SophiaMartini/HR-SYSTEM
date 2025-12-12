        // Funções globais para navegação
        function mostrarTelaColaborador(tela) {
            // Esconde todas as telas
            const screens = document.querySelectorAll('.screen');
            screens.forEach(screen => {
                screen.style.display = 'none';
            });
            
            // Remove classe active de todos os itens do menu
            const navItems = document.querySelectorAll('.navitem');
            navItems.forEach(item => item.classList.remove('active'));
            
            // Adiciona active ao item correspondente
            const navItem = Array.from(navItems).find(item => {
                return item.textContent.includes('Dashboard') && tela === 'dashboard-screen' ||
                       item.textContent.includes('Treinamentos') && tela === 'treinamentos-screen' ||
                       item.textContent.includes('Departamento') && tela === 'departamentos-screen' ||
                       item.textContent.includes('Perfil') && tela === 'perfil-screen';
            });
            
            if (navItem) {
                navItem.classList.add('active');
            }
            
            // Mostra a tela solicitada
            const targetScreen = document.getElementById(tela);
            if (targetScreen) {
                targetScreen.style.display = 'block';
                
                // Se for a tela de departamentos, carrega os dados
                if (tela === 'departamentos-screen') {
                    if (typeof carregarDepartamentoColaborador === 'function') {
                        carregarDepartamentoColaborador();
                    }
                }
            }
            
            // Fecha dropdown do perfil se estiver aberto
            const dropdown = document.getElementById('profile-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
            
            // Fecha menu mobile se estiver aberto
            const mobileMenu = document.getElementById('nav-dash');
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                mobileMenu.classList.remove('show');
            }
        }

        // Dropdown do perfil
        function toggleDropdown() {
            const dropdown = document.getElementById('profile-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        }

        // Menu mobile
        function toggleMobileMenu() {
            const menu = document.getElementById('nav-dash');
            if (menu) {
                menu.classList.toggle('show');
            }
        }

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                // Aqui você implementaria a lógica de logout
                localStorage.removeItem('usuario_id');
                localStorage.removeItem('colaborador_id');
                localStorage.removeItem('token');
                window.location.href = '/login.html';
            }
        });

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            // Mostrar dashboard inicialmente
            mostrarTelaColaborador('dashboard-screen');
            
            // Fechar dropdown ao clicar fora
            window.addEventListener('click', function(e) {
                const dropdown = document.getElementById('profile-dropdown');
                const profileImg = document.getElementById('profile-img');
                
                if (dropdown && dropdown.classList.contains('show') && 
                    !dropdown.contains(e.target) && 
                    !profileImg.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        });