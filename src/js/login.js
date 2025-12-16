document.addEventListener("DOMContentLoaded", () => {
  const cpfInput = document.getElementById("cpf");

  // garantia: inicializa AuthLocal (se existir) e aplica máscaras naquele momento
  try { if (window.AuthLocal && typeof AuthLocal.init === 'function') AuthLocal.init(); } catch(e){}
  try { if (window.Mask && typeof Mask.applyMasksToInputs === 'function') Mask.applyMasksToInputs(document); } catch(e){}

  const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .slice(0, 14);
    };
  
    // Apply inline mask as fallback
    cpfInput?.addEventListener('input', (e) => e.target.value = maskCPF(e.target.value));
    console.debug('login.js initialized: AuthLocal present=', !!window.AuthLocal, 'Mask present=', !!window.Mask);

  // corrigir id do formulário (underscores vs hyphen)
  const form = document.getElementById("login_form") || document.getElementById("login-form");
  
  // Elementos de visualização de senha (opcional) - aceita variações de id
  const togglePassword = document.getElementById("togglePassword") || document.getElementById("togglePassoword");
  const senhaInput = document.getElementById("senha");

  // Credenciais de teste removidas da UI — mantenho os mocks no AuthLocal para testes via DevTools.
  
  if (togglePassword && senhaInput) {
    togglePassword.addEventListener("click", () => {
      const type = senhaInput.getAttribute("type") === "password" ? "text" : "password";
      senhaInput.setAttribute("type", type);
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

  // Função centralizada de login para permitir fallback e logs claros
  async function doLogin(event){
    if (event && typeof event.preventDefault === 'function') try{ event.preventDefault(); }catch(e){}

    // remove máscara do CPF
    const cpfLimpo = (cpfInput && cpfInput.value) ? cpfInput.value.replace(/\D/g, "") : '';
    const senha = senhaInput ? senhaInput.value.trim() : '';

    console.debug('doLogin invoked, cpf=', cpfLimpo);

    if (!cpfLimpo || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Tenta autenticar localmente (localStorage)
      console.debug('Tentando login local com cpf=', cpfLimpo);
      if (window.AuthLocal) {
        const user = AuthLocal.login(cpfLimpo, senha);
        console.debug('AuthLocal.login result =', user);
        if (user) {
          AuthLocal.setCurrentUser(user);
          if (typeof AuthLocal.initHeaderUI === 'function') try{ AuthLocal.initHeaderUI(); }catch(e){}
          try{ console.debug('persisted current user after setCurrentUser:', AuthLocal.getCurrentUser()); }catch(e){}
          console.info('Login local efetuado para', user.nome, 'role=', user.role);
          alert('Login realizado com sucesso (local)!');

          // redirect robusto: resolve para o mesmo diretório onde a página atual está
          const destMap = { interno: 'dashboard-interno.html', candidato: 'dashboard-candidato.html', colaborador: 'dashboard-colaborador.html' };
          const dest = destMap[user.role];
          if (dest) {
            const attempts = [];
            const recordAttempt = () => {
              try{ localStorage.setItem('rh_last_login', JSON.stringify({ dest, userId: user.id, role: user.role, attempts, ts: Date.now() })); }catch(e){}
            };

            function tryRedirect(url){
              try{
                console.info('Tentando redirect para', url);
                attempts.push(url);
                recordAttempt();
                window.location.replace(url);
                return true;
              }catch(e){
                console.warn('Redirect falhou para', url, e);
                return false;
              }
            }

            // Tenta vários caminhos: absolute /src/, resolved base, relative ./, e direto
            const abs1 = '/src/' + dest;
            const base = window.location.pathname.replace(/\/[^/]*$/, '/');
            const resolved = base + dest;
            const rel = './' + dest;

            tryRedirect(abs1) || tryRedirect(resolved) || tryRedirect(rel) || tryRedirect(dest);

            // backups temporizados
            setTimeout(() => { try{ window.location.href = abs1; }catch(e){ try{ window.location.href = rel; }catch(e){ try{ window.location.href = dest; }catch(ee){} } } }, 300);
            return;
          } else {
            alert('Tipo de usuário inválido');
            return;
          }
        }
      }

      // Sem backend configurado: informar ao usuário que as credenciais não foram encontradas localmente
      console.debug('Usuário não encontrado localmente.');
      alert('Usuário não encontrado localmente e não há backend configurado. Verifique as credenciais ou cadastre-se.');
      return;

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro: " + (error.message || error));
    }
  }

  // Registra handler no formulário (se existir) ou adiciona fallback ao botão de login
  if (form) {
    form.addEventListener('submit', doLogin);
  } else {
    console.warn('Formulário de login não encontrado; registrando fallback no botão.');
    const btn = document.getElementById('btn-login');
    if (btn) btn.addEventListener('click', doLogin);
  }

  // Handler explícito no botão para garantir preventDefault e logs
  try{
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) {
      btnLogin.addEventListener('click', function(e){
        console.debug('btn-login clicked');
        // previne o submit nativo e chama a função de login com o evento
        try{ e.preventDefault(); }catch(err){}
        try{ doLogin(e); }catch(err){ console.error('doLogin error from button click', err); }
      });
    } else {
      console.warn('btn-login não encontrado no DOM');
    }
  }catch(e){ console.warn('erro ao registrar handler no btn-login', e); }

  // Helper global para o botão com onclick="logar()"
  window.logar = function() {
    try{ doLogin(); }catch(e){ console.error('logar() fallback error', e); }
  };

  // Debug: mostra usuário corrente no console (se houver)
  try{ console.debug('current user (localStorage):', window.AuthLocal ? AuthLocal.getCurrentUser() : null); }catch(e){}

});
