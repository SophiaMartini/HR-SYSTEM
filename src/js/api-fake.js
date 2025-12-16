// api-fake.js - camada de API fictícia que usa window.fakeDB
(function(window){
  if (!window.fakeDB) {
    console.warn('fakeDB não encontrado. Carregue database-simulacao.js antes de api-fake.js');
    window.API = {};
    return;
  }

  const API = {
    // Retorna departamentos
    getDepartamentos() {
      return Promise.resolve(fakeDB.getDepartamentos());
    },

    // Vagas por departamento
    getVagasByDepartamento(idDepartamento) {
      const vagas = fakeDB.getVagas().filter(v => v.id_departamento == idDepartamento);
      return Promise.resolve(vagas);
    },

    // Retorna vaga por id
    getVagaById(vagaId) {
      const v = fakeDB.getById('vagas', vagaId);
      return Promise.resolve(v);
    },

    // Candidaturas
    getCandidaturasByCandidato(candidatoId) {
      const all = fakeDB.getAll('candidaturas');
      const list = all.filter(c => String(c.id_candidato) === String(candidatoId)).map(cand => {
        const vaga = fakeDB.getById('vagas', cand.id_vaga) || {};
        const departamento = fakeDB.getDepartamentoById(vaga.id_departamento) || {};
        return {
          id_candidatura: cand.id_candidatura,
          id_vaga: cand.id_vaga,
          titulo_vaga: vaga.titulo || 'Vaga Não Informada',
          departamento_nome: departamento.nome || 'Não informado',
          data_candidatura: cand.data,
          tipo_contratacao: vaga.tipo_contratacao || '',
          localizacao: vaga.localizacao || '',
          status: cand.status || 'Pendente',
          feedback: cand.feedback || ''
        };
      });
      return Promise.resolve(list);
    },

    createCandidatura(payload) {
      // payload: { id_vaga, id_candidato }
      const novo = {
        id_candidatura: Date.now(),
        id_vaga: payload.id_vaga,
        id_candidato: payload.id_candidato,
        data: new Date().toLocaleString('pt-BR'),
        status: 'Pendente'
      };
      const saved = fakeDB.create('candidaturas', novo);
      return Promise.resolve(saved);
    },

    deleteCandidatura(candidaturaId) {
      const ok = fakeDB.delete('candidaturas', candidaturaId);
      return Promise.resolve({ success: ok });
    },

    verificarCandidatura(vagaId, candidatoId) {
      const all = fakeDB.getAll('candidaturas');
      const exists = all.some(c => String(c.id_vaga) === String(vagaId) && String(c.id_candidato) === String(candidatoId));
      return Promise.resolve({ jaCandidatado: exists });
    },

    // Suporte / envio - stub
    sendSupport(payload) {
      console.log('API.sendSupport (simulada)', payload);
      return Promise.resolve({ ok: true });
    }
  };

  window.API = API;
})(window);
