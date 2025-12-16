// masks.js - máscaras e helpers globais para inputs
(function(window){
  function maskCPF(value){
    return (value||'')
      .replace(/\D/g,'')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0,14);
  }

  function maskPhone(value){
    return (value||'')
      .replace(/\D/g,'')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0,15);
  }

  function maskCEP(value){
    return (value||'')
      .replace(/\D/g,'')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0,9);
  }

  function applyMasksToInputs(root = document){
    // CPF
    root.querySelectorAll('input.cpf, input[id*="cpf"]').forEach(input => {
      // Avoid duplicate handlers
      if (input.__maskCpfAttached) return;
      input.__maskCpfAttached = true;
      input.addEventListener('input', (e) => e.target.value = maskCPF(e.target.value));
    });

    // Celular
    root.querySelectorAll('input.celular, input[id*="celular"], input[id*="telefone"], input[name*="celular"]').forEach(input => {
      if (input.__maskPhoneAttached) return;
      input.__maskPhoneAttached = true;
      input.addEventListener('input', (e) => e.target.value = maskPhone(e.target.value));
    });

    // CEP
    root.querySelectorAll('input.cep, input[id*="cep"]').forEach(input => {
      if (input.__maskCepAttached) return;
      input.__maskCepAttached = true;
      input.addEventListener('input', (e) => e.target.value = maskCEP(e.target.value));
    });
  }

  // Formatar CPF para exibição
  function formatCPF(value){
    return maskCPF(value);
  }

  // Expor
  window.Mask = {
    maskCPF,
    maskPhone,
    maskCEP,
    applyMasksToInputs,
    formatCPF
  };

  // Auto-apply on DOMContentLoaded and after dynamic component loads
  function initAutoApply() {
    try {
      applyMasksToInputs(document);
    } catch(e){}
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Já está carregado — aplicar imediatamente
    setTimeout(initAutoApply, 20);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initAutoApply, 50));
  }

  document.addEventListener('componentLoaded', (e) => {
    try{ if (e && e.detail && e.detail.target) applyMasksToInputs(e.detail.target); }catch(err){}
  });

})(window);
