// auth-local.js - armazenamento de usuários para desenvolvimento
(function(window){
  const KEY = 'rh_users';
  const CUR_USER = 'rh_current_user';

  function getUsers(){
    try{
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    }catch(e){ return []; }
  }

  function saveUsers(users){
    localStorage.setItem(KEY, JSON.stringify(users));
  }

  function seedDefaults(){
    let users = getUsers();
    const hasAny = users && users.length;
    let merged = users.slice();

    // Se não houver usuários, cria valores padrão iniciais
    if (!hasAny) {
      const defaults = [
        { id: 'u-admin', nome: 'Admin', cpf: '00000000000', email:'admin@empresa.com', senha: '123', role: 'interno', autorizado: true, createdAt: new Date().toISOString() },
        { id: 'u-cand', nome: 'Candidato Teste', cpf: '00000000191', email:'candidato@teste.com', senha: 'candidato123', role: 'candidato', autorizado: false, createdAt: new Date().toISOString() }
      ];

      merged = defaults.slice();

      // Também importar usuários do fakeDB, se presente
      try {
        if (window.fakeDB && typeof fakeDB.getUsuarios === 'function'){
          const dbUsers = fakeDB.getUsuarios().map(u => ({
            id: 'u-db-' + (u.id || Date.now()),
            nome: u.nome || u.email || 'Usuário DB',
            cpf: (u.cpf || '').replace(/\D/g,''),
            email: u.email || '',
            senha: u.senha || '123',
            role: 'candidato',
            autorizado: true,
            createdAt: new Date().toISOString()
          }));
          // evitar duplicados por CPF
          dbUsers.forEach(dbU => {
            if (!merged.some(m => (m.cpf||'').replace(/\D/g,'') === (dbU.cpf||'').replace(/\D/g,''))) merged.push(dbU);
          });
        }
      } catch(e){/* ignore */}

      saveUsers(merged);
    } else {
      // Se já houver usuários, ainda tenta importar do fakeDB sem duplicar
      try {
        if (window.fakeDB && typeof fakeDB.getUsuarios === 'function'){
          const dbUsers = fakeDB.getUsuarios().map(u => ({
            id: 'u-db-' + (u.id || Date.now()),
            nome: u.nome || u.email || 'Usuário DB',
            cpf: (u.cpf || '').replace(/\D/g,''),
            email: u.email || '',
            senha: u.senha || '123',
            role: 'candidato',
            autorizado: true,
            createdAt: new Date().toISOString()
          }));
          dbUsers.forEach(dbU => {
            if (!merged.some(m => (m.cpf||'').replace(/\D/g,'') === (dbU.cpf||'').replace(/\D/g,''))) merged.push(dbU);
          });
          if (dbUsers.length) saveUsers(merged);
        }
      } catch(e){/* ignore */}
    }

    // Garante que certas contas mock existam (úteis para testes rápidos)
    function ensureMock(cpf, nome, email, senha, role, autorizado){
      const cleaned = (cpf||'').replace(/\D/g,'');
      let existing = merged.find(u => (u.cpf||'').replace(/\D/g,'') === cleaned);
      if (existing) {
        // atualiza informações essenciais
        existing.nome = nome;
        existing.email = email;
        existing.senha = senha;
        existing.role = role;
        existing.autorizado = autorizado;
      } else {
        existing = { id: 'u-' + Math.random().toString(36).slice(2,9), nome, email, cpf: cleaned, senha, role, autorizado, createdAt: new Date().toISOString() };
        merged.push(existing);
      }

      // Também garante que o fakeDB (se existir) tenha um usuário correspondente
      try{
        if (window.fakeDB && typeof fakeDB.getUsuarios === 'function'){
          const fusers = fakeDB.getUsuarios();
          if (!fusers.some(f => (f.cpf||'').replace(/\D/g,'') === cleaned)){
            // grava com CPF formatado para compatibilidade com outras partes do fakeDB
            const cpfFormatado = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            fakeDB.create('usuarios', { nome, email, senha, cpf: cpfFormatado, data_nascimento: '1990-01-01' });
          }
        }
      }catch(e){/* ignore */}
    }

    ensureMock('11111111111', 'Usuário Interno', 'interno@mock.local', 'interno123', 'interno', true);
    ensureMock('22222222222', 'Colaborador Mock', 'colaborador@mock.local', 'colaborador123', 'colaborador', true);
    ensureMock('33333333333', 'Candidato Mock', 'candidato@mock.local', 'candidato123', 'candidato', false);

    // Salva as alterações e retorna a lista atualizada
    saveUsers(merged);

    const fmt = s => (s||'').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    console.info('AuthLocal: mock accounts ready — Interno:', fmt('11111111111') + '/interno123, Colaborador:', fmt('22222222222') + '/colaborador123, Candidato:', fmt('33333333333') + '/candidato123');

    return merged;
  }

  function findByCpf(cpf){
    const cleaned = (cpf||'').replace(/\D/g, '');
    return getUsers().find(u => (u.cpf||'').replace(/\D/g,'') === cleaned) || null;
  }

  function addUser(user){
    const users = getUsers();
    users.push(user);
    saveUsers(users);
    return user;
  }

  function updateUserByCpf(cpf, updates){
    const cleaned = (cpf||'').replace(/\D/g, '');
    const users = getUsers();
    const idx = users.findIndex(u => (u.cpf||'').replace(/\D/g,'') === cleaned);
    if (idx === -1) return null;
    users[idx] = Object.assign({}, users[idx], updates);
    saveUsers(users);
    return users[idx];
  }

  function login(cpf, senha){
    const cleaned = (cpf||'').replace(/\D/g,'');
    const u = findByCpf(cleaned);
    if (!u) return null;

    // Normaliza roles legadas: 'recrutador' -> 'interno'
    if (u.role === 'recrutador') {
      try {
        updateUserByCpf(cleaned, { role: 'interno' });
        u.role = 'interno';
      } catch(e){ /* ignore */ }
    }

    if (u.senha === senha) return u;
    return null;
  }

  function getPendingCandidates(){
    return getUsers().filter(u => u.role === 'candidato');
  }

  function approveCandidate(cpf){
    const u = updateUserByCpf(cpf, { role: 'colaborador', autorizado: true });
    return u;
  }

  function setCurrentUser(user){
    if (!user) localStorage.removeItem(CUR_USER);
    else localStorage.setItem(CUR_USER, JSON.stringify(user));
  }

  function getCurrentUser(){
    try{ return JSON.parse(localStorage.getItem(CUR_USER) || 'null'); }catch(e){return null}
  }

  // Protege páginas frontend por role. Se não autenticado redireciona para login.
  function protectPage(allowedRoles = []){
    const user = getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return false;
    }
    if (allowedRoles.length && !allowedRoles.includes(user.role)){
      // redireciona para dashboard correto
      switch(user.role){
        case 'interno':
        case 'recrutador': // compatibilidade com dados legados
          window.location.href = 'dashboard-interno.html'; break;
        case 'colaborador': window.location.href = 'dashboard-colaborador.html'; break;
        case 'candidato': window.location.href = 'dashboard-candidato.html'; break;
        default: window.location.href = 'login.html';
      }
      return false;
    }
    return true;
  }

  // init
  function logout(){ setCurrentUser(null); window.location.href = 'login.html'; }

  function initHeaderUI(){
    try{
      const user = getCurrentUser();
      // nome pequeno ao lado do perfil
      document.querySelectorAll('.user-name-header').forEach(el => el.textContent = user ? user.nome : '');

      const dropdownName = document.querySelector('.dropdown-user-name');
      const dropdownEmail = document.querySelector('.dropdown-user-email');
      if (dropdownName) dropdownName.textContent = user ? user.nome : '';
      if (dropdownEmail) dropdownEmail.textContent = user ? (user.email || '') : '';

      const logoutBtn = document.getElementById('header-logout-btn');
      if (logoutBtn) {
        logoutBtn.removeEventListener('click', logout);
        logoutBtn.addEventListener('click', function(e){ e.preventDefault(); logout(); });
      }

      const mobileLogout = document.getElementById('mobile-logout-btn');
      if (mobileLogout) {
        mobileLogout.removeEventListener('click', logout);
        mobileLogout.addEventListener('click', function(e){ e.preventDefault(); logout(); });
      }

      const profileImg = document.getElementById('profile-btn');
      if (profileImg) {
        profileImg.src = (user && user.avatar) ? user.avatar : '/src/assets/imgs/images.jpg';
      }
    }catch(e){ console.warn('initHeaderUI error:', e); }
  }

  // Atualiza header quando o componente for inserido via fetch
  document.addEventListener('componentLoaded', (e) => {
    if (e && e.detail && e.detail.target && e.detail.target.querySelector('.user-name-header')) {
      initHeaderUI();
    }
  });

  // Tenta inicializar também ao carregar a página (caso o header já exista)
  document.addEventListener('DOMContentLoaded', () => setTimeout(initHeaderUI, 200));

  const exported = {
    KEY,
    CUR_USER,
    init: seedDefaults,
    getUsers,
    saveUsers,
    findByCpf,
    addUser,
    updateUserByCpf,
    login,
    getPendingCandidates,
    approveCandidate,
    setCurrentUser,
    getCurrentUser,
    protectPage,
    logout,
    initHeaderUI // expõe para que outros scripts possam forçar atualização do header
  };

  window.AuthLocal = exported;
  // auto init
  exported.init();
})(window);
