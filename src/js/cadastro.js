
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

   cpfInput.addEventListener('input', (e) => e.target.value = maskCPF(e.target.value));
    celularInput.addEventListener('input', (e) => e.target.value = maskPhone(e.target.value));
    cepInput.addEventListener('input', (e) => e.target.value = maskCEP(e.target.value));
    

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
        const obj = await r.json(); // objeto { "AF": "Afeganistão", "AL": "Albânia", ... }

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

  btnBuscarCep.addEventListener("click", () => {
    window.open("https://buscacepinter.correios.com.br/app/endereco/index.php", "_blank");
  });

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senhaOk = validarSenha();
    const confirmOk = confirmarSenha();
    if (!senhaOk || !confirmOk) {
      alert("Corrija os erros antes de enviar o formulário.");
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.edu_level = formData.getAll("edu_level[]");
    data.edu_status = formData.getAll("edu_status[]");
    data.edu_instituicao = formData.getAll("edu_instituicao[]");
    data.edu_inicio = formData.getAll("edu_inicio[]");
    data.edu_conclusao = formData.getAll("edu_conclusao[]");

    data.exp_empresa = formData.getAll("exp_empresa[]");
    data.exp_admissao = formData.getAll("exp_admissao[]");
    data.exp_demissao = formData.getAll("exp_demissao[]");
    data.exp_cargo = formData.getAll("exp_cargo[]");
    data.exp_descricao = formData.getAll("exp_descricao[]");

    console.log("Dados enviados:", data);

    try {
      // substituir a url pela do servido
      const response = await fetch("http://localhost:3000/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao enviar cadastro");

      const result = await response.json();
      alert("Cadastro realizado com sucesso!");
      console.log("Resposta do servidor:", result);

      // Redirecionar para próxima página ou login
      window.location.href = "login.html";

    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Erro ao enviar dados. Verifique sua conexão ou tente novamente.");
    }
  });

  // Inicialização
  carregarEstados();
  carregarNacionalidades();
});


