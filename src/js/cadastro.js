document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const cepInput = document.getElementById("cep");
  const btnBuscarCep = document.getElementById("btn-buscar-cep");
  const estadoSelect = document.getElementById("naturalidade");
  const nacionalidadeSelect = document.getElementById("nacionalidade");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmar-senha");
  const senhaError = document.getElementById("senha-error");
  const confirmarSenhaError = document.getElementById("confirmar-senha-error");
  const cpfInput = document.getElementById("cpf");
  const celularInput = document.getElementById("celular");
  const addEducationBtn = document.getElementById("add-education");
  const addExperienceBtn = document.getElementById("add-experience");
  const fileInput = document.getElementById("curriculo-file");
  const fileNameSpan = document.getElementById("file-name");

  let educationCount = 1;
  let experienceCount = 1;

  // Máscaras
  const maskCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  };

  const maskPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const maskCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
  };

  const maskDateMonthYear = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1')
      .slice(0, 7);
  };

  // Aplicar máscaras
  cpfInput.addEventListener('input', (e) => e.target.value = maskCPF(e.target.value));
  celularInput.addEventListener('input', (e) => e.target.value = maskPhone(e.target.value));
  cepInput.addEventListener('input', (e) => e.target.value = maskCEP(e.target.value));

  // Carregar estados brasileiros
  async function carregarEstados() {
    try {
      const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
      const estados = await response.json();

      estadoSelect.innerHTML = `<option value="" disabled selected>Selecione</option>`;
      estados.forEach((estado) => {
        const option = document.createElement("option");
        option.value = estado.sigla;
        option.textContent = estado.nome;
        estadoSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar estados:", error);
      estadoSelect.innerHTML = `<option value="" disabled selected>Erro ao carregar</option>`;
    }
  }

  // Carregar nacionalidades
  async function carregarNacionalidades() {
    nacionalidadeSelect.innerHTML = `<option value="" disabled selected>Carregando...</option>`;

    const urlUmpirsky = "https://raw.githubusercontent.com/umpirsky/country-list/master/data/pt_BR/country.json";
    const urlRestCountries = "https://restcountries.com/v3.1/all";

    const localFallback = [
      "Brasil", "Portugal", "Angola", "Moçambique", "Estados Unidos", "Canadá",
      "Reino Unido", "Espanha", "França", "Alemanha", "Itália", "Japão",
      "China", "Índia", "Argentina", "Uruguai", "Paraguai", "Venezuela"
    ];

    try {
      const r = await fetch(urlUmpirsky);
      if (!r.ok) throw new Error("Umpirsky fetch falhou");
      const obj = await r.json();

      const nomes = Object.values(obj).sort((a, b) => a.localeCompare(b, "pt", { sensitivity: "base" }));

      nacionalidadeSelect.innerHTML = `<option value="" disabled selected>Selecione</option>`;
      nomes.forEach((nome) => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        nacionalidadeSelect.appendChild(option);
      });
      return;
    } catch (err1) {
      console.warn("Falha ao carregar nacionalidades do umpirsky:", err1);
    }

    try {
      const r2 = await fetch(urlRestCountries);
      if (!r2.ok) throw new Error("RestCountries fetch falhou");
      const countries = await r2.json();

      const nomes = countries.map(country => {
        return (country.translations && country.translations.por && country.translations.por.common)
          ? country.translations.por.common
          : country.name && country.name.common
          ? country.name.common
          : null;
      }).filter(Boolean);

      nomes.sort((a, b) => a.localeCompare(b, "pt", { sensitivity: "base" }));

      nacionalidadeSelect.innerHTML = `<option value="" disabled selected>Selecione</option>`;
      nomes.forEach((nome) => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        nacionalidadeSelect.appendChild(option);
      });
      return;
    } catch (err2) {
      console.warn("Falha ao carregar nacionalidades do restcountries:", err2);
    }

    nacionalidadeSelect.innerHTML = `<option value="" disabled selected>Selecione</option>`;
    localFallback.sort((a, b) => a.localeCompare(b, "pt", { sensitivity: "base" }));
    localFallback.forEach((nome) => {
      const option = document.createElement("option");
      option.value = nome;
      option.textContent = nome;
      nacionalidadeSelect.appendChild(option);
    });
  }

  // Busca automática de CEP
  cepInput.addEventListener("input", async (e) => {
    let cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          alert("CEP não encontrado!");
          return;
        }

        document.getElementById("endereco").value = data.logradouro || "";
        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.localidade || "";
        document.getElementById("estado").value = data.uf || "";
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao consultar o CEP.");
      }
    }
  });

  // Botão para buscar CEP externamente
  btnBuscarCep.addEventListener("click", () => {
    window.open("https://buscacepinter.correios.com.br/app/endereco/index.php", "_blank");
  });

  // Validação de senha
  function validarSenha() {
    const senhaValida = senhaInput.value.length >= 8;
    senhaError.style.display = senhaValida ? "none" : "block";
    return senhaValida;
  }

  function confirmarSenha() {
    const iguais = senhaInput.value === confirmarSenhaInput.value;
    confirmarSenhaError.style.display = iguais ? "none" : "block";
    return iguais;
  }

  senhaInput.addEventListener("input", validarSenha);
  confirmarSenhaInput.addEventListener("input", confirmarSenha);

  // Adicionar nova formação
  addEducationBtn.addEventListener("click", () => {
    const educationList = document.getElementById("education-list");
    const newEntry = document.querySelector(".education-entry").cloneNode(true);
    
    // Atualizar IDs e names
    const inputs = newEntry.querySelectorAll("input, select");
    inputs.forEach(input => {
      const oldId = input.id;
      if (oldId) {
        const newId = oldId.replace(/\d+$/, educationCount);
        input.id = newId;
      }
      
      const oldName = input.name;
      if (oldName) {
        input.name = oldName;
      }
    });
    
    // Mostrar botão de remover
    newEntry.querySelector(".btn-remove").style.display = "block";
    
    // Adicionar evento de remoção
    newEntry.querySelector(".btn-remove").addEventListener("click", function() {
      this.closest(".education-entry").remove();
    });
    
    // Aplicar máscara para datas mês/ano
    const inicioInput = newEntry.querySelector('input[name="edu_inicio[]"]');
    const conclusaoInput = newEntry.querySelector('input[name="edu_conclusao[]"]');
    
    if (inicioInput) {
      inicioInput.addEventListener('input', (e) => e.target.value = maskDateMonthYear(e.target.value));
    }
    if (conclusaoInput) {
      conclusaoInput.addEventListener('input', (e) => e.target.value = maskDateMonthYear(e.target.value));
    }
    
    educationList.appendChild(newEntry);
    educationCount++;
  });

  // Adicionar nova experiência
  addExperienceBtn.addEventListener("click", () => {
    const experienceList = document.getElementById("experience-list");
    const newEntry = document.querySelector(".experience-entry").cloneNode(true);
    
    // Atualizar IDs e names
    const inputs = newEntry.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
      const oldId = input.id;
      if (oldId) {
        const newId = oldId.replace(/\d+$/, experienceCount);
        input.id = newId;
      }
      
      const oldName = input.name;
      if (oldName && oldName.includes('_0')) {
        input.name = oldName.replace('_0', `_${experienceCount}`);
      }
    });
    
    // Atualizar labels dos radio buttons
    const radioSim = newEntry.querySelector('input[type="radio"][value="sim"]');
    const radioNao = newEntry.querySelector('input[type="radio"][value="nao"]');
    const labelSim = newEntry.querySelector('label[for^="exp-atual-sim"]');
    const labelNao = newEntry.querySelector('label[for^="exp-atual-nao"]');
    
    if (radioSim) {
      radioSim.id = `exp-atual-sim-${experienceCount}`;
      radioSim.name = `exp_atual_${experienceCount}`;
    }
    if (radioNao) {
      radioNao.id = `exp-atual-nao-${experienceCount}`;
      radioNao.name = `exp_atual_${experienceCount}`;
      radioNao.checked = true;
    }
    if (labelSim) {
      labelSim.htmlFor = `exp-atual-sim-${experienceCount}`;
    }
    if (labelNao) {
      labelNao.htmlFor = `exp-atual-nao-${experienceCount}`;
    }
    
    // Mostrar botão de remover
    newEntry.querySelector(".btn-remove").style.display = "block";
    
    // Adicionar evento de remoção
    newEntry.querySelector(".btn-remove").addEventListener("click", function() {
      this.closest(".experience-entry").remove();
    });
    
    // Aplicar máscara para datas mês/ano
    const admissaoInput = newEntry.querySelector('input[name="exp_admissao[]"]');
    const demissaoInput = newEntry.querySelector('input[name="exp_demissao[]"]');
    
    if (admissaoInput) {
      admissaoInput.addEventListener('input', (e) => e.target.value = maskDateMonthYear(e.target.value));
    }
    if (demissaoInput) {
      demissaoInput.addEventListener('input', (e) => e.target.value = maskDateMonthYear(e.target.value));
    }
    
    // Evento para mostrar/ocultar data de demissão
    const atualRadioButtons = newEntry.querySelectorAll('.exp-atual-radio');
    atualRadioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        const demissaoGroup = newEntry.querySelector('[id^="exp-demissao-group"]');
        if (this.value === 'sim') {
          demissaoGroup.style.display = 'none';
          demissaoGroup.querySelector('input').value = '';
        } else {
          demissaoGroup.style.display = 'block';
        }
      });
    });
    
    experienceList.appendChild(newEntry);
    experienceCount++;
  });

  // Gerenciar upload de arquivo
  if (fileInput && fileNameSpan) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        fileNameSpan.textContent = file.name;
      } else {
        fileNameSpan.textContent = "Nenhum arquivo selecionado";
      }
    });
  }

  // Envio do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senhaOk = validarSenha();
    const confirmOk = confirmarSenha();
    if (!senhaOk || !confirmOk) {
      alert("Corrija os erros antes de enviar o formulário.");
      return;
    }

    // Preparar dados para envio
    const formData = new FormData(form);
    
    // Adicionar dados de arrays
    const eduLevels = document.querySelectorAll('select[name="edu_level[]"]');
    const eduStatuses = document.querySelectorAll('select[name="edu_status[]"]');
    const eduInstituicoes = document.querySelectorAll('input[name="edu_instituicao[]"]');
    const eduInicios = document.querySelectorAll('input[name="edu_inicio[]"]');
    const eduConclusoes = document.querySelectorAll('input[name="edu_conclusao[]"]');
    
    const expEmpresas = document.querySelectorAll('input[name="exp_empresa[]"]');
    const expAdmissoes = document.querySelectorAll('input[name="exp_admissao[]"]');
    const expDemissoes = document.querySelectorAll('input[name="exp_demissao[]"]');
    const expCargos = document.querySelectorAll('input[name="exp_cargo[]"]');
    const expDescricoes = document.querySelectorAll('textarea[name="exp_descricao[]"]');
    
    // Criar objeto de dados
    const data = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      cpf: formData.get('cpf'),
      data_nascimento: formData.get('data_nascimento'),
      estado_civil: formData.get('estado_civil'),
      nacionalidade: formData.get('nacionalidade'),
      naturalidade: formData.get('naturalidade'),
      genero: formData.get('genero'),
      deficiencia: formData.get('deficiencia') === 'on' ? 'sim' : 'nao',
      celular: formData.get('celular'),
      senha: formData.get('senha'),
      cep: formData.get('cep'),
      endereco: formData.get('endereco'),
      numero: formData.get('numero'),
      complemento: formData.get('complemento'),
      bairro: formData.get('bairro'),
      cidade: formData.get('cidade'),
      estado: formData.get('estado')
    };
    
    // Adicionar formações
    data.formacoes = [];
    for (let i = 0; i < eduLevels.length; i++) {
      data.formacoes.push({
        grau_escolaridade: eduLevels[i].value,
        instituicao: eduInstituicoes[i].value,
        situacao: eduStatuses[i].value,
        data_inicio: eduInicios[i].value,
        data_conclusao: eduConclusoes[i].value
      });
    }
    
    // Adicionar experiências
    data.experiencias = [];
    for (let i = 0; i < expEmpresas.length; i++) {
      const expAtual = document.querySelector(`input[name="exp_atual_${i}"]:checked`);
      data.experiencias.push({
        empresa: expEmpresas[i].value,
        cargo: expCargos[i].value,
        emprego_atual: expAtual ? expAtual.value === 'sim' : false,
        data_admissao: expAdmissoes[i].value,
        data_demissao: expDemissoes[i].value,
        descricao: expDescricoes[i].value
      });
    }

    console.log("Dados enviados:", data);

    // Primeiro, tenta salvar localmente (localStorage) usando AuthLocal
    try {
      if (window.AuthLocal) {
        const cpfLimpo = (data.cpf || '').replace(/\D/g, '');
        if (AuthLocal.findByCpf(cpfLimpo)) {
          alert('Já existe um usuário cadastrado com este CPF. Faça login ou recupere a senha.');
          return;
        }

        const newUser = {
          id: 'u-' + Date.now(),
          nome: data.nome,
          email: data.email,
          cpf: cpfLimpo,
          senha: data.senha,
          role: 'candidato',
          autorizado: false,
          createdAt: new Date().toISOString()
        };

        AuthLocal.addUser(newUser);
        alert('Cadastro realizado localmente! Aguardar aprovação interna para virar colaborador.');
        window.location.href = 'login.html';
        return;
      }

      // Se AuthLocal não disponível, tenta enviar para a API
      const response = await fetch("http://localhost:3000/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao enviar cadastro");
      }

      const result = await response.json();
      alert("Cadastro realizado com sucesso!");
      console.log("Resposta do servidor:", result);

      // Redirecionar para login
      window.location.href = "login.html";

    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Erro ao enviar dados: " + error.message);
    }
  });

  // Inicialização
  carregarEstados();
  carregarNacionalidades();
  
  // Aplicar máscaras para datas de formação/experiência existentes
  document.querySelectorAll('input[name="edu_inicio[]"], input[name="edu_conclusao[]"], input[name="exp_admissao[]"], input[name="exp_demissao[]"]').forEach(input => {
    input.addEventListener('input', (e) => e.target.value = maskDateMonthYear(e.target.value));
  });
  
  // Evento para radio buttons de emprego atual
  document.querySelectorAll('.exp-atual-radio').forEach(radio => {
    radio.addEventListener('change', function() {
      const entryIndex = this.name.match(/\d+/)[0];
      const demissaoGroup = document.getElementById(`exp-demissao-group-${entryIndex}`);
      if (this.value === 'sim') {
        demissaoGroup.style.display = 'none';
        demissaoGroup.querySelector('input').value = '';
      } else {
        demissaoGroup.style.display = 'block';
      }
    });
  });
});d