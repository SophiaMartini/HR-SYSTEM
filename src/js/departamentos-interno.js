// departamentos.js
(function(){
  const STORAGE_KEY = 'rh_departamentos_v1';

  // scoped selectors (work only inside departamentos-screen)
  function qs(sel, root=document) { return root.querySelector(sel); }
  function qsa(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }

  function seedData(){
    // seed baseado no modelo físico (exemplo reduzido)
    const seed = [
      {
        id_departamento: 1,
        nome: 'Tecnologia',
        descricao: 'Responsável por infraestrutura e desenvolvimento.',
        telefone: '11 99999-1111',
        sigla: 'TI',
        ativo: 'ATIVO',
        colaboradores: [
          { id_colaborador: 101, nome: 'Eduardo Ribeiro', cargo: 'Analista RH', telefone: '456884456', salario: 4500.00 },
          { id_colaborador: 102, nome: 'Mariana Silva', cargo: 'Dev Front', telefone: '1198888-2222', salario: 7000.00 }
        ],
        cargos: [
          { id_cargo: 201, titulo: 'Administrador de Redes', descricao: 'Cuida da infraestrutura', vagas: 1 },
          { id_cargo: 202, titulo: 'Desenvolvedor Front', descricao: 'React/JS', vagas: 2 }
        ]
      },
      {
        id_departamento: 2,
        nome: 'Comercial',
        descricao: 'Vendas e relacionamento com clientes.',
        telefone: '11 98888-3333',
        sigla: 'COM',
        ativo: 'ATIVO',
        colaboradores: [
          { id_colaborador: 103, nome: 'Ana Pereira', cargo: 'Vendedora', telefone: '1197777-4444', salario: 3200.00 }
        ],
        cargos: [
          { id_cargo: 203, titulo: 'Vendedor', descricao: 'Atende clientes', vagas: 3 }
        ]
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  function readData(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return seedData();
    try { return JSON.parse(raw); }
    catch(e){ console.error('parse error', e); return seedData(); }
  }

  function writeData(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // render list of departments
  function renderList(container, data){
    container.innerHTML = '';
    const ul = qs('#items-list', container.closest('#departamentos-screen')) || container;
    ul.innerHTML = '';
    data.forEach(dep => {
      const li = document.createElement('li');
      li.className = 'items';
      li.dataset.id = dep.id_departamento;
      li.innerHTML = `
        <div class="item">
          <div class="item-content">
            <h2 class="item-title">${escapeHtml(dep.nome)}</h2>
            <span class="item-desc">${escapeHtml(truncate(dep.descricao,150))}</span>
            <button class="button-default_02 btn-info" data-action="open">Mais informações</button>
          </div>
        </div>
        <div class="buttons-container">
          <button class="trash-button btn-delete" data-action="delete"><h3><i class="fa-solid fa-trash"></i></h3></button>
          <button class="edit-button btn-edit" data-action="edit"><h3><i class="fa-solid fa-pen-to-square"></i></h3></button>
        </div>
      `;
      ul.appendChild(li);
    });
  }

  function truncate(str, n){ return str.length>n? str.slice(0,n)+'...': str; }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

  // search filter
  function filterByName(data, q){
    if(!q) return data;
    q = q.trim().toLowerCase();
    return data.filter(d => d.nome.toLowerCase().includes(q) || (d.descricao||'').toLowerCase().includes(q));
  }

  // event handlers
  function attachHandlers(root, store){
    const screenRoot = root;
    // search
    const searchInput = qs('#search', screenRoot);
    if(searchInput){
      searchInput.addEventListener('input', () => {
        const all = readData();
        const filtered = filterByName(all, searchInput.value);
        renderList(screenRoot, filtered);
      });
    }

    // clicks on list (delegate)
    const itemsList = qs('#items-list', screenRoot);
    if(itemsList){
      itemsList.addEventListener('click', (e)=>{
        const li = e.target.closest('li.items');
        if(!li) return;
        const id = Number(li.dataset.id);
        const actionBtn = e.target.closest('button');
        const action = actionBtn && actionBtn.dataset.action;
        if(action === 'delete'){
          if(confirm('Excluir departamento?')) {
            const all = readData();
            const idx = all.findIndex(d=>d.id_departamento===id);
            if(idx>=0) { all.splice(idx,1); writeData(all); renderList(screenRoot, all); }
          }
        } else if(action === 'edit'){
          // open edit screen (populate)
          const department = readData().find(d=>d.id_departamento===id);
          if(department){
            // expose department to edit module and show screen
            window.EdicaoDepartamentoModule && window.EdicaoDepartamentoModule.openFor(department);
            // if you prefer to change hash / show screen via your router, call here:
            // window.showScreen && window.showScreen('edicao-departamentos-screen');
          }
        } else if(action === 'open'){
          const department = readData().find(d=>d.id_departamento===id);
          if(department){
            // show quick info modal or navigate to edit (I will open edit)
            window.EdicaoDepartamentoModule && window.EdicaoDepartamentoModule.openFor(department);
          }
        }
      });
    }

    // add departamento button (top)
    const addBtn = screenRoot.querySelector('.add-departamento-button');
    if(addBtn){
      addBtn.addEventListener('click', ()=>{
        // create new department with next id and open edit
        const all = readData();
        const nextId = all.reduce((m,d)=>Math.max(m,d.id_departamento||0),0)+1;
        const newDep = {
          id_departamento: nextId,
          nome: 'Novo departamento',
          descricao: '',
          telefone: '',
          sigla: '',
          ativo: 'ATIVO',
          colaboradores: [],
          cargos: []
        };
        all.push(newDep); writeData(all);
        renderList(screenRoot, all);
        // open edit
        window.EdicaoDepartamentoModule && window.EdicaoDepartamentoModule.openFor(newDep);
      });
    }
  }

  // Public init
  function init(){
    const root = document.getElementById('departamentos-screen');
    if(!root) return;
    const data = readData();
    renderList(root, data);
    attachHandlers(root);
  }

  // expose
  window.DepartamentosModule = { init };
  // Auto-init when page loads
  document.addEventListener('DOMContentLoaded', init);
})();

n