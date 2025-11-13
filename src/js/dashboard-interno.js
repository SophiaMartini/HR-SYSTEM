
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Seletor / elementos principais ---------- */
  const btns = document.querySelectorAll('button[id$="-btn"]'); // todos os botões que terminam com -btn
  const novoTreinamentoBtn = document.getElementById('novoTreinamentoBtn');
  const formWrapper = document.getElementById('formTreinamento');
  const cadastroForm = document.getElementById('cadastroTreinamento');
  const cancelarBtn = document.getElementById('canvelarFormBtn0');
  const addAulaBtn = document.getElementById('addAulaBtn');
  const listaAulas = document.getElementById('listaAulas');
  const treinamentosGrid = document.getElementById('treinamentos_grid');

  const instrutorSelect = document.getElementById('instrutorCurso');
  const imagemInput = document.getElementById('imagemCurso');

  /* ---------- Dados locais / fallback ---------- */
  // fallback de colaboradores caso a API não exista (para testes)
  const colaboradoresFallback = [
    { id: 1, nome: 'Marina Souza', cargo: 'Analista de RH' },
    { id: 2, nome: 'João Pereira', cargo: 'Gerente de Projetos' },
    { id: 3, nome: 'Beatriz Lima', cargo: 'Especialista em Treinamento' },
    { id: 4, nome: 'Carlos Nogueira', cargo: 'Consultor de Desenvolvimento' }
  ];

  /* ---------- Utilitários ---------- */
  function hideAllScreens() {
    // Esconde todas as telas que terminem com -screen (IDs esperados)
    const screens = document.querySelectorAll('[id$="-screen"]');
    screens.forEach(s => s.style.display = 'none');
  }

  function showScreenByButtonId(btnId) {
    const base = btnId.replace('-btn', ''); // e.g. 'treinamentos'
    const screenId = `${base}-screen`; // 'treinamentos-screen'
    hideAllScreens();
    const target = document.getElementById(screenId);
    if (target) {
      target.style.display = 'block';
    } else {
      console.warn(`Tela ${screenId} não encontrada no HTML.`);
    }
  }

  /* ---------- Navegação: ligar botões do dashboard/header ---------- */
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      showScreenByButtonId(btn.id);
    });
  });

  // Inicia mostrando dashboard se existir
  if (document.getElementById('dashboard-screen')) {
    hideAllScreens();
    document.getElementById('dashboard-screen').style.display = 'block';
  }

  /* ---------- Carregar instrutores (tenta API, senão fallback) ---------- */
  async function preencherInstrutores() {
    instrutorSelect.innerHTML = '<option value="">Selecione um instrutor</option>';
    try {
      const resp = await fetch('/api/instrutores.php');
      if (!resp.ok) throw new Error('API não disponível');
      const data = await resp.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error('Resposta vazia');
      data.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.id;
        opt.textContent = `${i.nome} — ${i.cargo ?? ''}`;
        instrutorSelect.appendChild(opt);
      });
    } catch (err) {
      // fallback local
      colaboradoresFallback.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.id;
        opt.textContent = `${i.nome} — ${i.cargo}`;
        instrutorSelect.appendChild(opt);
      });
      console.info('Carregado instrutores via fallback local (sem API).', err.message);
    }
  }

  /* ---------- Aulas: criação dinâmica ---------- */
  function criarAulaDOM(aulaData = {}) {
    const aula = document.createElement('div');
    aula.className = 'aula';

    aula.innerHTML = `
      <input type="text" class="tituloAula" placeholder="Título da aula" required value="${aulaData.titulo || ''}">
      <textarea class="descAula" placeholder="Descrição ou resumo">${aulaData.descricao || ''}</textarea>
      <label>Materiais:</label>
      <div class="materiais">
        <input type="file" accept="video/*" class="videoAula">
        <input type="file" accept="application/pdf" class="pdfAula">
        <input type="url" placeholder="Link externo (Google Forms, YouTube, etc.)" class="linkAula" value="${aulaData.link || ''}">
      </div>
      <div style="margin-top:8px; display:flex; gap:8px;">
        <button type="button" class="removerAulaBtn">Remover aula</button>
      </div>
    `;

    const remover = aula.querySelector('.removerAulaBtn');
    remover.addEventListener('click', () => aula.remove());

    // Se aulaData tiver vídeos/pdfs como base64 ou nomes, podemos mostrar (opcional)
    listaAulas.appendChild(aula);
    return aula;
  }

  addAulaBtn && addAulaBtn.addEventListener('click', () => criarAulaDOM());

  /* ---------- Imagem da capa: ler base64 (apenas para preview/localStorage) ---------- */
  function lerImagemComoBase64(file) {
    return new Promise((res, rej) => {
      if (!file) return res(null);
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = () => rej(new Error('Erro ao ler imagem'));
      reader.readAsDataURL(file);
    });
  }

  /* ---------- localStorage: CRUD simples de treinamentos ---------- */
  const LS_KEY = 'rh_treinamentos_v1';

  function carregarTreinamentosDoStorage() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Erro ao parsear treinamentos do localStorage', err);
      return [];
    }
  }

  function salvarTreinamentosNoStorage(arr) {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  }

  function gerarId() {
    return 't' + Date.now() + Math.floor(Math.random() * 1000);
  }

  /* ---------- Renderizar grid de cursos ---------- */
  function renderizarGrid() {
    treinamentosGrid.innerHTML = '';
    const lista = carregarTreinamentosDoStorage();
    if (!lista.length) {
      treinamentosGrid.innerHTML = '<p>Nenhum treinamento cadastrado.</p>';
      return;
    }

    lista.forEach(t => {
      const card = document.createElement('div');
      card.className = 'card_treinamento';
      card.style.border = '1px solid #ddd';
      card.style.padding = '12px';
      card.style.borderRadius = '8px';
      card.style.marginBottom = '12px';
      card.innerHTML = `
        <div style="display:flex; gap:12px; align-items:center;">
          <div style="width:120px; height:80px; flex-shrink:0; background:#f4f4f4; display:flex;align-items:center;justify-content:center;border-radius:6px; overflow:hidden;">
            ${t.capa ? `<img src="${t.capa}" alt="capa" style="width:100%;height:100%;object-fit:cover;">` : `<i class="fa-solid fa-graduation-cap" style="font-size:28px;color:#777"></i>`}
          </div>
          <div style="flex:1;">
            <h3 style="margin:0 0 6px 0">${t.titulo}</h3>
            <p style="margin:0 0 6px 0;color:#555">${t.descricao ?? ''}</p>
            <small style="color:#666">Instrutor: ${t.instrutorNome ?? '—'}</small>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <button class="editarBtn" data-id="${t.id}">Editar</button>
            <button class="excluirBtn" data-id="${t.id}">Excluir</button>
          </div>
        </div>
      `;
      treinamentosGrid.appendChild(card);

      // ligar eventos
      card.querySelector('.excluirBtn').addEventListener('click', () => {
        if (!confirm('Deseja excluir este treinamento?')) return;
        const arr = carregarTreinamentosDoStorage().filter(x => x.id !== t.id);
        salvarTreinamentosNoStorage(arr);
        renderizarGrid();
      });

      card.querySelector('.editarBtn').addEventListener('click', () => {
        abrirFormularioEdicao(t.id);
      });
    });
  }

  /* ---------- Abrir formulário para novo treinamento ---------- */
  novoTreinamentoBtn && novoTreinamentoBtn.addEventListener('click', async () => {
    // limpa e mostra
    cadastroForm.reset();
    listaAulas.innerHTML = '';
    await preencherInstrutores();
    formWrapper.style.display = 'block';
    // guarda estado de criação (sem id)
    cadastroForm.dataset.editId = '';
    // pode abrir com uma aula já pronta (opcional)
    // criarAulaDOM();
    window.scrollTo({ top: formWrapper.offsetTop - 20, behavior: 'smooth' });
  });

  /* ---------- Cancelar ---------- */
  cancelarBtn && cancelarBtn.addEventListener('click', () => {
    formWrapper.style.display = 'none';
    cadastroForm.reset();
    listaAulas.innerHTML = '';
  });

  /* ---------- Abrir formulário para editar ---------- */
  async function abrirFormularioEdicao(id) {
    const arr = carregarTreinamentosDoStorage();
    const item = arr.find(i => i.id === id);
    if (!item) return alert('Treinamento não encontrado para edição.');

    cadastroForm.reset();
    listaAulas.innerHTML = '';
    await preencherInstrutores();

    // preencher campos
    document.getElementById('tituloCurso').value = item.titulo || '';
    document.getElementById('descricaoCurso').value = item.descricao || '';
    if (item.instrutorId) instrutorSelect.value = item.instrutorId;
    // capa: não alteramos input file, apenas armazenamos imagem base64 no objeto
    if (Array.isArray(item.aulas)) {
      item.aulas.forEach(a => criarAulaDOM(a));
    }
    cadastroForm.dataset.editId = id; // marca edição
    formWrapper.style.display = 'block';
    window.scrollTo({ top: formWrapper.offsetTop - 20, behavior: 'smooth' });
  }

  /* ---------- Submissão do formulário (criar / editar) ---------- */
  cadastroForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('tituloCurso').value.trim();
    const descricao = document.getElementById('descricaoCurso').value.trim();
    const instrutorId = instrutorSelect.value;
    const instrutorNome = instrutorSelect.options[instrutorSelect.selectedIndex]?.text || '';
    // ler capa (se selecionada)
    let capaBase64 = null;
    if (imagemInput && imagemInput.files && imagemInput.files[0]) {
      try {
        capaBase64 = await lerImagemComoBase64(imagemInput.files[0]);
      } catch (err) {
        console.error('Erro ao ler imagem:', err);
      }
    }

    // coletar aulas
    const aulasDOM = Array.from(listaAulas.querySelectorAll('.aula'));
    const aulas = aulasDOM.map(a => {
      const tituloA = a.querySelector('.tituloAula')?.value || '';
      const descA = a.querySelector('.descAula')?.value || '';
      const link = a.querySelector('.linkAula')?.value || '';
      // arquivos de vídeo/pdf não são convertidos aqui (poderia ser feito similar à capa)
      return { titulo: tituloA, descricao: descA, link };
    });

    // montar objeto
    const isEdit = !!cadastroForm.dataset.editId;
    const arr = carregarTreinamentosDoStorage();

    if (isEdit) {
      const id = cadastroForm.dataset.editId;
      const idx = arr.findIndex(x => x.id === id);
      if (idx === -1) return alert('Erro: item para editar não encontrado.');
      arr[idx] = {
        ...arr[idx],
        titulo, descricao, instrutorId, instrutorNome,
        capa: capaBase64 || arr[idx].capa, // mantém antiga se não trocar
        aulas
      };
      salvarTreinamentosNoStorage(arr);
      alert('Treinamento atualizado com sucesso!');
    } else {
      const novo = {
        id: gerarId(),
        titulo, descricao, instrutorId, instrutorNome,
        capa: capaBase64,
        aulas,
        criadoEm: new Date().toISOString()
      };
      arr.push(novo);
      salvarTreinamentosNoStorage(arr);
      alert('Treinamento cadastrado com sucesso!');
    }

    // resetar e atualizar grid
    formWrapper.style.display = 'none';
    cadastroForm.reset();
    listaAulas.innerHTML = '';
    renderizarGrid();
  });

  /* ---------- Iniciar: renderiza grid e tenta preencher instrutores ---------- */
  (async () => {
    await preencherInstrutores(); // carrega select para quando abrir
    renderizarGrid();
  })();

});