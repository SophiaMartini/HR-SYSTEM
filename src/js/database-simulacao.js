// src/js/fakeDatabase.js
// Banco de dados fake que persiste no localStorage

class FakeDatabase {
    constructor() {
        this.initDatabase();
    }

    initDatabase() {
        // Se não existir dados no localStorage, cria os dados iniciais
        if (!localStorage.getItem('hr_database')) {
            const initialData = {
                departamentos: [
                    { id_departamento: 1, nome: 'Recursos Humanos', descricao: 'Departamento de RH', localizacao: 'Sede', telefone: '(11) 9999-8888', sigla: 'RH', attivo: 'ATIVO' },
                    { id_departamento: 2, nome: 'Tecnologia da Informação', descricao: 'Departamento de TI', localizacao: 'Sede', telefone: '(11) 9999-7777', sigla: 'TI', attivo: 'ATIVO' },
                    { id_departamento: 3, nome: 'Financeiro', descricao: 'Departamento Financeiro', localizacao: 'Sede', telefone: '(11) 9999-6666', sigla: 'FIN', attivo: 'ATIVO' }
                ],
                usuarios: [
                    { id: 1, nome: 'Admin', email: 'admin@empresa.com', senha: '123', cpf: '000.000.000-00', data_nascimento: '1990-01-01' }
                ],
                cargos: [
                    { id_cargo: 1, id_departamento: 1, titulo: 'Analista de RH', descricao: 'Analista de Recursos Humanos' },
                    { id_cargo: 2, id_departamento: 2, titulo: 'Desenvolvedor', descricao: 'Desenvolvedor Full Stack' }
                ],
                colaboradores: [
                    { id_colaborador: 1, id_usuario: 1, id_cargo: 2, id_departamento: 2, data_admissao: '2024-01-01', salario: 5000, tipo_contrato: 'CLT', status: 'Ativo' }
                ],
                vagas: [
                    { id_vaga: 1, id_cargo: 1, id_departamento: 1, titulo: 'Analista de RH Jr', descricao: 'Vaga para analista de RH', requisitos: 'Experiência em RH', tipo_contratacao: 'Efetivo', localizacao: 'São Paulo', status: 'Aberta', data_publicacao: '2024-12-12' }
                ],
                candidaturas: [
                    { id_candidatura: 1001, id_vaga: 1, id_candidato: 1, data: '20/06/2024 - 09:00', status: 'Pendente' }
                ]
            };
            localStorage.setItem('hr_database', JSON.stringify(initialData));
        }
    }

    // Métodos genéricos para qualquer tabela
    getAll(tableName) {
        const db = JSON.parse(localStorage.getItem('hr_database') || '{}');
        return db[tableName] || [];
    }

    getById(tableName, id) {
        const items = this.getAll(tableName);
        return items.find(item => {
            // Encontra pelo ID correto (id_departamento, id_usuario, etc)
            const idKey = Object.keys(item).find(key => key.includes('id_') || key === 'id');
            return item[idKey] == id;
        });
    }

    create(tableName, data) {
        const db = JSON.parse(localStorage.getItem('hr_database') || '{}');
        const items = db[tableName] || [];
        
        // Encontra o próximo ID
        let nextId = 1;
        if (items.length > 0) {
            const idKey = Object.keys(items[0]).find(key => key.includes('id_') || key === 'id');
            nextId = Math.max(...items.map(item => item[idKey])) + 1;
        }
        
        // Determina o nome do campo ID (id_departamento, id_usuario, etc)
        let idField = 'id';
        if (tableName === 'departamentos') idField = 'id_departamento';
        else if (tableName === 'usuarios') idField = 'id';
        else if (tableName === 'cargos') idField = 'id_cargo';
        else if (tableName === 'colaboradores') idField = 'id_colaborador';
        else if (tableName === 'vagas') idField = 'id_vaga';
        else if (tableName === 'candidaturas') idField = 'id_candidatura';
        
        const newItem = { [idField]: nextId, ...data };
        items.push(newItem);
        db[tableName] = items;
        localStorage.setItem('hr_database', JSON.stringify(db));
        
        return newItem;
    }

    update(tableName, id, data) {
        const db = JSON.parse(localStorage.getItem('hr_database') || '{}');
        const items = db[tableName] || [];
        const idKey = Object.keys(items[0] || {}).find(key => key.includes('id_') || key === 'id');
        
        const index = items.findIndex(item => item[idKey] == id);
        if (index !== -1) {
            // Mantém o ID original
            const updatedItem = { ...items[index], ...data };
            updatedItem[idKey] = id; // Garante que o ID não mude
            items[index] = updatedItem;
            db[tableName] = items;
            localStorage.setItem('hr_database', JSON.stringify(db));
            return updatedItem;
        }
        return null;
    }

    delete(tableName, id) {
        const db = JSON.parse(localStorage.getItem('hr_database') || '{}');
        const items = db[tableName] || [];
        const idKey = Object.keys(items[0] || {}).find(key => key.includes('id_') || key === 'id');
        
        const newItems = items.filter(item => item[idKey] != id);
        db[tableName] = newItems;
        localStorage.setItem('hr_database', JSON.stringify(db));
        
        return newItems.length !== items.length;
    }

    // Métodos específicos para departamentos (mais fácil de usar)
    getDepartamentos() {
        return this.getAll('departamentos');
    }

    addDepartamento(departamento) {
        return this.create('departamentos', departamento);
    }

    updateDepartamento(id, departamento) {
        return this.update('departamentos', id, departamento);
    }

    deleteDepartamento(id) {
        return this.delete('departamentos', id);
    }

    // Métodos para outras tabelas...
    getCargos() {
        return this.getAll('cargos');
    }

    getUsuarios() {
        return this.getAll('usuarios');
    }

    getColaboradores() {
        return this.getAll('colaboradores');
    }

    getVagas() {
        return this.getAll('vagas');
    }

    // Candidaturas
    getCandidaturas() {
        return this.getAll('candidaturas');
    }

    addCandidatura(candidatura) {
        return this.create('candidaturas', candidatura);
    }

    // Busca departamento por ID
    getDepartamentoById(id) {
        return this.getById('departamentos', id);
    }
}

// Exporta uma instância global
window.fakeDB = new FakeDatabase();