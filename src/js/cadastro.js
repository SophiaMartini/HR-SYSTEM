document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS ---
    const form = document.getElementById('registration-form');
    
    // API CEP
    const cepInput = document.getElementById('cep');
    // ... (outros seletores de endereço)

    // API Selects
    // ... (seletores de nacionalidade, etc.)
    
    // Inputs com Máscara
    const cpfInput = document.getElementById('cpf');
    const celularInput = document.getElementById('celular');
    // O input de data de nascimento foi removido daqui

    // ========== [ SELETORES ADICIONADOS ] ==========
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');
    const senhaError = document.getElementById('senha-error');
    const confirmarSenhaError = document.getElementById('confirmar-senha-error');
    // =============================================

    // ... (outros seletores: upload, seções dinâmicas)


    // --- FUNÇÕES DE MÁSCARA ---
    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .slice(0, 14);
    };

    // A máscara de data foi removida, pois usamos type="date"
    
    const maskPhone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);
    };

    // ========== [ MÁSCARA ADICIONADA ] ==========
    const maskCEP = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 9);
    };
    // ============================================

    const maskMonthYear = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .slice(0, 7);
    };

    // Aplicando máscaras no evento 'input' (enquanto digita)
    cpfInput.addEventListener('input', (e) => e.target.value = maskCPF(e.target.value));
    celularInput.addEventListener('input', (e) => e.target.value = maskPhone(e.target.value));
    cepInput.addEventListener('input', (e) => e.target.value = maskCEP(e.target.value));

    // ... (Função applyDynamicMasks sem mudanças) ...
    applyDynamicMasks(document); 

    // --- (Funções de API: ViaCEP, IBGE, Countries, Universidades - Sem mudanças) ---
    // ...
    // ...

    // --- (Lógica de Seções Dinâmicas: Adicionar/Remover, Emprego Atual - Sem mudanças) ---
    // ...
    // ...
    
    // --- (Lógica de Upload de Arquivo - Sem mudanças) ---
    // ...
    
    // ========== [ VALIDAÇÃO DE SENHA EM TEMPO REAL ] ==========
    const validatePassword = () => {
        let isValid = true;
        
        // 1. Valida Força da Senha (mínimo 8 caracteres)
        if (senhaInput.value.length > 0 && senhaInput.value.length < 8) {
            senhaError.style.display = 'block';
            senhaInput.classList.add('input-error');
            isValid = false;
        } else {
            senhaError.style.display = 'none';
            senhaInput.classList.remove('input-error');
        }

        // 2. Valida Correspondência de Senhas
        if (confirmarSenhaInput.value.length > 0 && senhaInput.value !== confirmarSenhaInput.value) {
            confirmarSenhaError.style.display = 'block';
            confirmarSenhaInput.classList.add('input-error');
            isValid = false;
        } else {
            confirmarSenhaError.style.display = 'none';
            confirmarSenhaInput.classList.remove('input-error');
        }
        
        return isValid;
    };

    // Adiciona listeners para validar enquanto digita
    senhaInput.addEventListener('keyup', validatePassword);
    confirmarSenhaInput.addEventListener('keyup', validatePassword);
    // =========================================================

    // --- LÓGICA: SUBMISSÃO DO FORMULÁRIO ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Roda a validação de senha uma última vez
        const isPasswordValid = validatePassword();
        
        // Validação geral do navegador (campos 'required', 'minlength', etc.)
        if (!form.checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            form.reportValidity(); // Mostra quais campos falharam
            return;
        }
        
        // Validação específica das senhas
        if (!isPasswordValid) {
             alert('Por favor, corrija os erros na sua senha.');
             return;
        }
        
        // Coleta de dados
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // ... (Tratamento do switch 'deficiencia', igual ao anterior)
        data.deficiencia = formData.has('deficiencia') ? 'sim' : 'nao';
        
        // ... (Coleta de Formações e Experiências, igual ao anterior)
        data.formacoes = [];
        document.querySelectorAll('.education-entry').forEach(entry => {
            data.formacoes.push({
                nivel: entry.querySelector('[name="edu_level[]"]').value,
                status: entry.querySelector('[name="edu_status[]"]').value,
                instituicao: entry.querySelector('[name="edu_instituicao[]"]').value,
                inicio: entry.querySelector('[name="edu_inicio[]"]').value,
                conclusao: entry.querySelector('[name="edu_conclusao[]"]').value,
            });
        });

        data.experiencias = [];
        document.querySelectorAll('.experience-entry').forEach((entry, index) => {
            data.experiencias.push({
                empresa: entry.querySelector('[name="exp_empresa[]"]').value,
                emprego_atual: entry.querySelector(`[name="exp_atual_${index}"]:checked`).value,
                admissao: entry.querySelector('[name="exp_admissao[]"]').value,
                demissao: entry.querySelector('[name="exp_demissao[]"]').value,
                cargo: entry.querySelector('[name="exp_cargo[]"]').value,
                descricao: entry.querySelector('[name="exp_descricao[]"]').value,
            });
        });
        
        // Limpa os campos de array
        // ... (delete data['...[]'], igual ao anterior)
        
        // Exibe o resultado (para fins de demonstração)
        console.log('Dados do Formulário Coletados:');
        
        // Não queremos a senha no log, então removemos
        delete data.senha;
        delete data.confirmar_senha;
        
        console.log(JSON.stringify(data, null, 2));
        
        // ========== [ REDIRECIONAMENTO ] ==========
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        
        // Redireciona para a página de login após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html'; // Altere para a URL correta da sua página de login
        }, 2000);
        // ===========================================
    });

    // --- CARREGAMENTO INICIAL DAS APIs ---
    loadStates();
    loadNationalities();
});