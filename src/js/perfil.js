document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('edit-save-button');
    const modal = document.getElementById('edit-modal');
    const closeButton = modal.querySelector('.close-button');
    const form = document.getElementById('edit-form');
    
    // --- 1. Lógica do Modal de Edição ---

    // Função para abrir o modal e preencher com dados atuais
    function openModal() {
        document.querySelectorAll('.info-item p[data-field]').forEach(pElement => {
            const field = pElement.getAttribute('data-field');
            const value = pElement.textContent.trim();
            const input = document.getElementById(`modal-${field}`);
            if (input) {
                input.value = value;
            }
        });
        
        modal.style.display = 'block';
    }

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Eventos de Abertura e Fechamento do Modal
    if (editButton) {
        editButton.addEventListener('click', openModal);
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Fecha o modal quando o usuário clica fora dele
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Submissão do formulário (Simulação de Salvamento)
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o recarregamento da página

            // Atualiza os dados na página principal
            const formData = new FormData(form);
            for (const [key, value] of formData.entries()) {
                const pElement = document.querySelector(`.info-item p[data-field="${key}"]`);
                if (pElement) {
                    pElement.textContent = value;
                }
            }
            
            alert('Informações salvas com sucesso! (Simulação)');
            closeModal();
        });
    }

    // --- 2. Lógica para Troca de Foto de Perfil ---
    
    const changePhotoTrigger = document.getElementById('change-photo-trigger');
    const photoUploadInput = document.getElementById('photo-upload-input');
    const profileMainPicture = document.getElementById('profile-main-picture');

    // Abre o seletor de arquivo ao clicar no texto
    if (changePhotoTrigger && photoUploadInput) {
        changePhotoTrigger.addEventListener('click', function() {
            photoUploadInput.click();
        });
    }

    // Pré-visualiza e aplica a nova foto
    if (photoUploadInput && profileMainPicture) {
        photoUploadInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Atualiza a imagem principal do perfil
                    profileMainPicture.src = e.target.result; 
                    
                    // Opcional: Atualiza a imagem do header 
                    const headerProfileBtn = document.getElementById('profile-btn');
                    if (headerProfileBtn) {
                        headerProfileBtn.src = e.target.result;
                    }

                    alert('Foto de perfil atualizada! (Simulação)');
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // --- 3. Lógica para Menu Hambúrguer (Mobile) ---
    
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navbar = document.getElementById('navbar');

    if (hamburgerBtn && navbar) {
        hamburgerBtn.addEventListener('click', function() {
            // Alterna a classe 'open' que mostra/esconde o menu
            navbar.classList.toggle('open');
        });
    }

});