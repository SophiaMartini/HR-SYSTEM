// perfil.js - Funcionalidades dinâmicas para a tela de perfil

document.addEventListener('DOMContentLoaded', () => {
    // Dados mock baseados no modelo do banco de dados
    const mockUserData = {
        id: 1,
        nome: 'João da Silva',
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-9999',
        localizacao: 'QE 45 Conjunto E Casa 10, Guará II, Brasília - DF',
        cpf: '123.456.789-00',
        dataNascimento: '1990-05-15',
        estadoCivil: 'Casado',
        nacionalidade: 'Brasileiro',
        naturalidadeEstado: 'São Paulo',
        naturalidadeCidade: 'São Paulo',
        genero: 'Masculino',
        possuiDeficiencia: false,
        experienciaProfissional: [
            {
                id: 1,
                empresa: 'Tech Solutions Ltd.',
                cargo: 'Desenvolvedor Full Stack',
                empregoAtual: true,
                dataAdmissao: '2022-01-01',
                dataDemissao: null,
                descricaoAtividades: 'Desenvolvimento de aplicações web usando React, Node.js e PostgreSQL.'
            },
            {
                id: 2,
                empresa: 'StartXYZ',
                cargo: 'Desenvolvedor Junior',
                empregoAtual: false,
                dataAdmissao: '2020-04-01',
                dataDemissao: '2021-12-31',
                descricaoAtividades: 'Desenvolvimento de aplicações web usando React, Node.js e PostgreSQL.'
            }
        ],
        formacaoAcademica: [
            {
                id: 1,
                grauEscolaridade: 'Bacharelado em Ciência da Computação',
                instituicao: 'Universidade de São Paulo',
                situacao: 'Concluído',
                dataInicio: '2016-01-01',
                dataConclusao: '2020-12-31'
            }
        ]
    };

    // Estado da aplicação
    let isEditMode = false;
    let editingExperienceId = null;
    let editingEducationId = null;

    /* --------------------------------------------------------------------------
        INICIALIZAÇÃO
    -------------------------------------------------------------------------- */
    function initProfilePage() {
        // Merge dados do AuthLocal (se existir) para substituir os mocks
        mergeAuthUserData();

        // Carrega dados do usuário
        loadUserData();
        
        // Carrega experiências profissionais
        loadExperiences();
        
        // Carrega formações acadêmicas
        loadEducations();
        
        // Configura eventos
        setupEventListeners();

    }

    // Integração com AuthLocal / fakeDB: se houver um usuário logado, usa esses dados
    function mergeAuthUserData(){
        try{
            if (window.AuthLocal && typeof AuthLocal.getCurrentUser === 'function'){
                const cu = AuthLocal.getCurrentUser();
                if (cu){
                    // Prioriza nome/email vindo do AuthLocal
                    mockUserData.nome = cu.nome || mockUserData.nome;
                    mockUserData.email = cu.email || mockUserData.email;
                    // Tentativa de mapear telefone/endereço a partir do fakeDB se disponível
                    try{
                        if (window.fakeDB && typeof fakeDB.getUsuarios === 'function'){
                            const cleaned = (cu.cpf||'').replace(/\D/g,'');
                            const udb = fakeDB.getUsuarios().find(u => (u.cpf||'').replace(/\D/g,'') === cleaned);
                            if (udb){
                                // pode conter telefone, localizacao, data_nascimento
                                if (udb.telefone) mockUserData.telefone = udb.telefone;
                                if (udb.endereco) mockUserData.localizacao = udb.endereco;
                                if (udb.data_nascimento) mockUserData.dataNascimento = udb.data_nascimento;
                                // também atualiza CPF apresentável
                                mockUserData.cpf = udb.cpf || cu.cpf || mockUserData.cpf;
                            } else {
                                // se não tem no fakeDB, usa o CPF do AuthLocal
                                if (cu.cpf) mockUserData.cpf = cu.cpf;
                            }
                        }
                    }catch(e){/* ignore */}
                }
            }
        }catch(e){ console.warn('mergeAuthUserData error', e); }
    }
    }

    /* --------------------------------------------------------------------------
        CARREGAMENTO DE DADOS
    -------------------------------------------------------------------------- */
    function loadUserData() {
        // Informações pessoais
        document.querySelector('[data-field="nome-completo"]').textContent = mockUserData.nome;
        document.querySelector('[data-field="email"]').textContent = mockUserData.email;
        document.querySelector('[data-field="telefone"]').textContent = mockUserData.telefone;
        document.querySelector('[data-field="localizacao"]').textContent = mockUserData.localizacao;
    }

    function loadExperiences() {
        const container = document.querySelector('.professional-experience');
        
        // Limpa conteúdo estático existente
        const existingItems = container.querySelectorAll('.experience-item');
        existingItems.forEach(item => item.remove());
        
        // Adiciona cada experiência
        mockUserData.experienciaProfissional.forEach(exp => {
            const experienceItem = createExperienceElement(exp);
            container.appendChild(experienceItem);
        });
        
        // Adiciona botão para nova experiência
        const addButton = document.createElement('button');
        addButton.className = 'edit-button add-experience-btn';
        addButton.innerHTML = '<i class="fas fa-plus"></i> Adicionar Experiência';
        addButton.addEventListener('click', () => showAddExperienceForm());
        container.appendChild(addButton);
    }

    function loadEducations() {
        const container = document.querySelector('.academic-education');
        
        // Limpa conteúdo estático existente
        const existingItems = container.querySelectorAll('.education-item');
        existingItems.forEach(item => item.remove());
        
        // Adiciona cada formação
        mockUserData.formacaoAcademica.forEach(edu => {
            const educationItem = createEducationElement(edu);
            container.appendChild(educationItem);
        });
        
        // Adiciona botão para nova formação
        const addButton = document.createElement('button');
        addButton.className = 'edit-button add-education-btn';
        addButton.innerHTML = '<i class="fas fa-plus"></i> Adicionar Formação';
        addButton.addEventListener('click', () => showAddEducationForm());
        container.appendChild(addButton);
    }

    /* --------------------------------------------------------------------------
        CRIAÇÃO DE ELEMENTOS DINÂMICOS
    -------------------------------------------------------------------------- */
    function createExperienceElement(experience) {
        const div = document.createElement('div');
        div.className = 'experience-item';
        div.dataset.id = experience.id;
        
        div.innerHTML = `
            <h3>${experience.cargo}</h3>
            <p class="company">${experience.empresa}</p>
            <p class="period">${formatDate(experience.dataAdmissao)} - ${experience.empregoAtual ? 'Presente' : formatDate(experience.dataDemissao)}</p>
            <p class="description">${experience.descricaoAtividades}</p>
            <div class="experience-actions" style="display: none;">
                <button class="action-btn edit-experience-btn" data-id="${experience.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="action-btn delete-experience-btn" data-id="${experience.id}">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;
        
        return div;
    }

    function createEducationElement(education) {
        const div = document.createElement('div');
        div.className = 'education-item';
        div.dataset.id = education.id;
        
        div.innerHTML = `
            <h3>${education.grauEscolaridade}</h3>
            <p class="institution">${education.instituicao}</p>
            <p class="period">${formatDate(education.dataInicio)} - ${education.situacao === 'Concluído' ? formatDate(education.dataConclusao) : 'Cursando'}</p>
            <p class="description">Situação: ${education.situacao}</p>
            <div class="education-actions" style="display: none;">
                <button class="action-btn edit-education-btn" data-id="${education.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="action-btn delete-education-btn" data-id="${education.id}">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;
        
        return div;
    }

    /* --------------------------------------------------------------------------
        MODO EDIÇÃO - INFORMAÇÕES PESSOAIS
    -------------------------------------------------------------------------- */
    function toggleEditMode() {
        const editButton = document.getElementById('edit-save-button');
        const infoItems = document.querySelectorAll('.info-item p.display-mode');
        
        if (!isEditMode) {
            // Entrar no modo de edição
            isEditMode = true;
            editButton.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
            editButton.style.backgroundColor = '#4CAF50';
            
            // Converter campos para inputs
            infoItems.forEach(item => {
                const field = item.dataset.field;
                const value = item.textContent;
                let input;
                
                switch(field) {
                    case 'nome-completo':
                        input = document.createElement('input');
                        input.type = 'text';
                        input.value = value;
                        input.className = 'edit-mode';
                        break;
                    case 'email':
                        input = document.createElement('input');
                        input.type = 'email';
                        input.value = value;
                        input.className = 'edit-mode';
                        break;
                    case 'telefone':
                        input = document.createElement('input');
                        input.type = 'tel';
                        input.value = value;
                        input.className = 'edit-mode';
                        break;
                    case 'localizacao':
                        input = document.createElement('textarea');
                        input.value = value;
                        input.className = 'edit-mode';
                        input.rows = 1;
                        break;
                }
                
                item.style.display = 'none';
                item.parentNode.appendChild(input);
            });
            
            // Mostrar botões de ação para experiência/educação
            document.querySelectorAll('.experience-actions, .education-actions').forEach(actions => {
                actions.style.display = 'flex';
            });
            
        } else {
            // Salvar alterações
            isEditMode = false;
            editButton.innerHTML = '<i class="fas fa-edit"></i> Editar';
            editButton.style.backgroundColor = '#e9943b';
            
            // Salvar dados e atualizar visualização
            const updatedData = {};
            infoItems.forEach(item => {
                const field = item.dataset.field;
                const input = item.parentNode.querySelector('.edit-mode');
                
                if (input) {
                    updatedData[field] = input.value;
                    item.textContent = input.value;
                    item.style.display = 'block';
                    input.remove();
                }
            });
            
            // Salvar no mock data (em um caso real, seria uma chamada API)
            mockUserData.nome = updatedData['nome-completo'] || mockUserData.nome;
            mockUserData.email = updatedData['email'] || mockUserData.email;
            mockUserData.telefone = updatedData['telefone'] || mockUserData.telefone;
            mockUserData.localizacao = updatedData['localizacao'] || mockUserData.localizacao;

            // Persistir alterações no AuthLocal (se houver)
            try{
                if (window.AuthLocal && typeof AuthLocal.getCurrentUser === 'function'){
                    const cu = AuthLocal.getCurrentUser();
                    if (cu && cu.cpf){
                        const cleaned = (cu.cpf||'').replace(/\D/g,'');
                        const updates = { nome: mockUserData.nome, email: mockUserData.email };
                        if (mockUserData.telefone) updates.telefone = mockUserData.telefone;
                        try{ AuthLocal.updateUserByCpf(cleaned, updates); }catch(e){ console.warn('AuthLocal update failed', e); }
                        try{ AuthLocal.initHeaderUI(); }catch(e){}
                    }
                }
            }catch(e){ console.warn('persist profile to AuthLocal error', e); }

            // Também tenta persistir no fakeDB se existir
            try{
                if (window.fakeDB && typeof fakeDB.getUsuarios === 'function'){
                    const cu = AuthLocal.getCurrentUser ? AuthLocal.getCurrentUser() : null;
                    const cleaned = cu && cu.cpf ? (cu.cpf||'').replace(/\D/g,'') : null;
                    if (cleaned){
                        const udb = fakeDB.getUsuarios().find(u => (u.cpf||'').replace(/\D/g,'') === cleaned);
                        if (udb){
                            try{ fakeDB.update('usuarios', udb.id, { nome: mockUserData.nome, email: mockUserData.email, telefone: mockUserData.telefone || udb.telefone }); }catch(e){/* ignore */}
                        }
                    }
                }
            }catch(e){/* ignore */}

            // Esconder botões de ação
            document.querySelectorAll('.experience-actions, .education-actions').forEach(actions => {
                actions.style.display = 'none';
            });
            
            // Mostrar feedback
            showNotification('Informações salvas com sucesso!', 'success');
        }
    }

    /* --------------------------------------------------------------------------
        GERENCIAMENTO DE EXPERIÊNCIAS
    -------------------------------------------------------------------------- */
    function showAddExperienceForm() {
        const container = document.querySelector('.professional-experience');
        const addButton = container.querySelector('.add-experience-btn');
        
        // Remove botão de adicionar temporariamente
        addButton.style.display = 'none';
        
        // Cria formulário
        const formDiv = document.createElement('div');
        formDiv.className = 'add-new-form';
        formDiv.innerHTML = `
            <h4>Nova Experiência Profissional</h4>
            <input type="text" id="exp-empresa" placeholder="Empresa" required>
            <input type="text" id="exp-cargo" placeholder="Cargo" required>
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <input type="date" id="exp-admissao" placeholder="Data de Admissão" required style="flex: 1;">
                <input type="date" id="exp-demissao" placeholder="Data de Demissão (deixe em branco se atual)" style="flex: 1;">
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <input type="checkbox" id="exp-atual" style="margin-right: 0.5rem;">
                <label for="exp-atual">Emprego Atual</label>
            </div>
            <textarea id="exp-descricao" placeholder="Descrição das atividades" rows="4"></textarea>
            <div class="form-buttons">
                <button class="action-btn save-btn" id="save-exp-btn">
                    <i class="fas fa-save"></i> Salvar
                </button>
                <button class="action-btn cancel-btn" id="cancel-exp-btn">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        `;
        
        container.insertBefore(formDiv, addButton);
        
        // Configurar eventos do formulário
        document.getElementById('save-exp-btn').addEventListener('click', saveNewExperience);
        document.getElementById('cancel-exp-btn').addEventListener('click', () => {
            formDiv.remove();
            addButton.style.display = 'block';
        });
    }

    function saveNewExperience() {
        const empresa = document.getElementById('exp-empresa').value;
        const cargo = document.getElementById('exp-cargo').value;
        const dataAdmissao = document.getElementById('exp-admissao').value;
        const dataDemissao = document.getElementById('exp-demissao').value;
        const empregoAtual = document.getElementById('exp-atual').checked;
        const descricao = document.getElementById('exp-descricao').value;
        
        if (!empresa || !cargo || !dataAdmissao) {
            showNotification('Preencha os campos obrigatórios!', 'error');
            return;
        }
        
        // Cria nova experiência
        const newExperience = {
            id: Date.now(), // ID temporário
            empresa,
            cargo,
            dataAdmissao,
            dataDemissao: empregoAtual ? null : dataDemissao,
            empregoAtual,
            descricaoAtividades: descricao
        };
        
        // Adiciona ao array de dados
        mockUserData.experienciaProfissional.push(newExperience);
        
        // Recarrega a lista
        loadExperiences();
        
        showNotification('Experiência adicionada com sucesso!', 'success');
    }

    /* --------------------------------------------------------------------------
        GERENCIAMENTO DE FORMAÇÕES
    -------------------------------------------------------------------------- */
    function showAddEducationForm() {
        const container = document.querySelector('.academic-education');
        const addButton = container.querySelector('.add-education-btn');
        
        addButton.style.display = 'none';
        
        const formDiv = document.createElement('div');
        formDiv.className = 'add-new-form';
        formDiv.innerHTML = `
            <h4>Nova Formação Acadêmica</h4>
            <input type="text" id="edu-grau" placeholder="Grau Escolaridade (ex: Bacharelado)" required>
            <input type="text" id="edu-instituicao" placeholder="Instituição de Ensino" required>
            <select id="edu-situacao" style="width: 100%; padding: 0.8rem; margin-bottom: 1rem;">
                <option value="Concluído">Concluído</option>
                <option value="Cursando">Cursando</option>
                <option value="Trancado">Trancado</option>
            </select>
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <input type="date" id="edu-inicio" placeholder="Data de Início" style="flex: 1;">
                <input type="date" id="edu-conclusao" placeholder="Data de Conclusão" style="flex: 1;">
            </div>
            <div class="form-buttons">
                <button class="action-btn save-btn" id="save-edu-btn">
                    <i class="fas fa-save"></i> Salvar
                </button>
                <button class="action-btn cancel-btn" id="cancel-edu-btn">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        `;
        
        container.insertBefore(formDiv, addButton);
        
        document.getElementById('save-edu-btn').addEventListener('click', saveNewEducation);
        document.getElementById('cancel-edu-btn').addEventListener('click', () => {
            formDiv.remove();
            addButton.style.display = 'block';
        });
    }

    function saveNewEducation() {
        const grau = document.getElementById('edu-grau').value;
        const instituicao = document.getElementById('edu-instituicao').value;
        const situacao = document.getElementById('edu-situacao').value;
        const dataInicio = document.getElementById('edu-inicio').value;
        const dataConclusao = document.getElementById('edu-conclusao').value;
        
        if (!grau || !instituicao || !dataInicio) {
            showNotification('Preencha os campos obrigatórios!', 'error');
            return;
        }
        
        const newEducation = {
            id: Date.now(),
            grauEscolaridade: grau,
            instituicao,
            situacao,
            dataInicio,
            dataConclusao: situacao === 'Concluído' ? dataConclusao : null
        };
        
        mockUserData.formacaoAcademica.push(newEducation);
        loadEducations();
        
        showNotification('Formação adicionada com sucesso!', 'success');
    }

    /* --------------------------------------------------------------------------
        FUNÇÕES AUXILIARES
    -------------------------------------------------------------------------- */
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    function showNotification(message, type) {
        // Remove notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 5px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        `;
        
        document.body.appendChild(notification);
        
        // Remove após 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    /* --------------------------------------------------------------------------
        CONFIGURAÇÃO DE EVENTOS
    -------------------------------------------------------------------------- */
    function setupEventListeners() {
        // Botão de editar/salvar informações pessoais
        const editButton = document.getElementById('edit-save-button');
        if (editButton) {
            editButton.addEventListener('click', toggleEditMode);
        }
        
        // Alteração de foto de perfil
        const changePhotoTrigger = document.getElementById('change-photo-trigger');
        const photoUploadInput = document.getElementById('photo-upload-input');
        const profilePicture = document.getElementById('profile-main-picture');
        
        if (changePhotoTrigger && photoUploadInput && profilePicture) {
            changePhotoTrigger.addEventListener('click', () => {
                photoUploadInput.click();
            });
            
            profilePicture.addEventListener('click', () => {
                photoUploadInput.click();
            });
            
            photoUploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        profilePicture.src = event.target.result;
                        showNotification('Foto de perfil atualizada com sucesso!', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Delegation para botões de experiência (editar/excluir)
        document.addEventListener('click', (e) => {
            // Editar experiência
            if (e.target.closest('.edit-experience-btn')) {
                const expId = parseInt(e.target.closest('.edit-experience-btn').dataset.id);
                editExperience(expId);
            }
            
            // Excluir experiência
            if (e.target.closest('.delete-experience-btn')) {
                const expId = parseInt(e.target.closest('.delete-experience-btn').dataset.id);
                if (confirm('Tem certeza que deseja excluir esta experiência?')) {
                    deleteExperience(expId);
                }
            }
            
            // Editar formação
            if (e.target.closest('.edit-education-btn')) {
                const eduId = parseInt(e.target.closest('.edit-education-btn').dataset.id);
                editEducation(eduId);
            }
            
            // Excluir formação
            if (e.target.closest('.delete-education-btn')) {
                const eduId = parseInt(e.target.closest('.delete-education-btn').dataset.id);
                if (confirm('Tem certeza que deseja excluir esta formação?')) {
                    deleteEducation(eduId);
                }
            }
        });
    }

    function editExperience(expId) {
        const experience = mockUserData.experienciaProfissional.find(exp => exp.id === expId);
        if (!experience) return;
        
        // Aqui você implementaria a lógica para editar uma experiência existente
        // Por simplicidade, vou remover e adicionar um novo formulário
        deleteExperience(expId);
        showAddExperienceForm();
        
        // Preenche o formulário com os dados existentes
        setTimeout(() => {
            document.getElementById('exp-empresa').value = experience.empresa;
            document.getElementById('exp-cargo').value = experience.cargo;
            document.getElementById('exp-admissao').value = experience.dataAdmissao;
            document.getElementById('exp-demissao').value = experience.dataDemissao || '';
            document.getElementById('exp-atual').checked = experience.empregoAtual;
            document.getElementById('exp-descricao').value = experience.descricaoAtividades;
        }, 100);
    }

    function deleteExperience(expId) {
        mockUserData.experienciaProfissional = mockUserData.experienciaProfissional.filter(exp => exp.id !== expId);
        loadExperiences();
        showNotification('Experiência excluída com sucesso!', 'success');
    }

    function editEducation(eduId) {
        const education = mockUserData.formacaoAcademica.find(edu => edu.id === eduId);
        if (!education) return;
        
        deleteEducation(eduId);
        showAddEducationForm();
        
        setTimeout(() => {
            document.getElementById('edu-grau').value = education.grauEscolaridade;
            document.getElementById('edu-instituicao').value = education.instituicao;
            document.getElementById('edu-situacao').value = education.situacao;
            document.getElementById('edu-inicio').value = education.dataInicio;
            document.getElementById('edu-conclusao').value = education.dataConclusao || '';
        }, 100);
    }

    function deleteEducation(eduId) {
        mockUserData.formacaoAcademica = mockUserData.formacaoAcademica.filter(edu => edu.id !== eduId);
        loadEducations();
        showNotification('Formação excluída com sucesso!', 'success');
    }

    /* --------------------------------------------------------------------------
        INICIALIZAÇÃO DA PÁGINA
    -------------------------------------------------------------------------- */
    initProfilePage();
});