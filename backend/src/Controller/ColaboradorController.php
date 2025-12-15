<?php

namespace App\Controller;

use App\Domain\Repository\ColaboradorRepository;
use PDOException;
use Exception;

class ColaboradorController
{
    private $repository;

    public function __construct()
    {
        $this->repository = new ColaboradorRepository();
    }

    
    public function getAll()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $colaboradores = $this->repository->findAll();
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $colaboradores,
                'total' => count($colaboradores)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao buscar colaboradores',
                'details' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

   
    public function getById($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $colaborador = $this->repository->findById($id);
            
            if (!$colaborador) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Colaborador não encontrado.'
                ]);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $colaborador
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao buscar colaborador',
                'details' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

   
    public function create()
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            
            $camposObrigatorios = ['id_usuario', 'id_cargo', 'id_departamento', 'data_admissao', 'salario', 'tipo_contrato'];
            $camposFaltando = [];

            foreach ($camposObrigatorios as $campo) {
                if (empty($data[$campo])) {
                    $camposFaltando[] = $campo;
                }
            }

            if (!empty($camposFaltando)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Campos obrigatórios faltando',
                    'campos_faltando' => $camposFaltando
                ]);
                return;
            }

            
            error_log("🔍 Verificando se usuário existe: " . $data['id_usuario']);
            if (!$this->repository->usuarioExists($data['id_usuario'])) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Usuário não encontrado. Crie o usuário primeiro.',
                    'id_usuario_buscado' => $data['id_usuario']
                ]);
                return;
            }

            
            error_log("🔍 Verificando se já é colaborador: " . $data['id_usuario']);
            $jaEhColaborador = $this->repository->usuarioJaEhColaborador($data['id_usuario']);
            if ($jaEhColaborador) {
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'error' => 'Este usuário já é um colaborador.',
                    'id_colaborador_existente' => $jaEhColaborador['id_colaborador']
                ]);
                return;
            }

           
            error_log("🔍 Verificando se cargo existe: " . $data['id_cargo']);
            if (!$this->repository->cargoExists($data['id_cargo'])) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Cargo não encontrado.',
                    'id_cargo_buscado' => $data['id_cargo']
                ]);
                return;
            }

            
            error_log("🔍 Verificando se departamento existe: " . $data['id_departamento']);
            if (!$this->repository->departamentoExists($data['id_departamento'])) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Departamento não encontrado.',
                    'id_departamento_buscado' => $data['id_departamento']
                ]);
                return;
            }

            
            error_log("✅ Criando colaborador...");
            $newId = $this->repository->create($data);
            error_log("✅ Colaborador criado com ID: " . $newId);

            
            error_log("🔍 Buscando colaborador recém-criado...");
            $novoColaborador = $this->repository->findById($newId);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Colaborador criado com sucesso!',
                'data' => $novoColaborador
            ]);

        } catch (PDOException $e) {
            error_log("❌ PDOException: " . $e->getMessage());
            error_log("❌ SQL State: " . $e->getCode());
            
            if ($e->getCode() == 23000) {
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'error' => 'Conflito: Este usuário já é um colaborador ou há dados duplicados.',
                    'details' => $e->getMessage()
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Erro de Banco de Dados',
                    'details' => $e->getMessage(),
                    'sql_state' => $e->getCode()
                ]);
            }
        } catch (Exception $e) {
            error_log("❌ Exception: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro interno',
                'details' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

   
    public function update($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            if (empty($data)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Nenhum dado enviado para atualização.'
                ]);
                return;
            }

            $affectedRows = $this->repository->update($id, $data);
            
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Colaborador não encontrado ou nenhum dado foi alterado.'
                ]);
                return;
            }
            
            $updatedColaborador = $this->repository->findById($id);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Colaborador atualizado com sucesso!',
                'data' => $updatedColaborador
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao atualizar',
                'details' => $e->getMessage()
            ]);
        }
    }

  
    public function delete($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $affectedRows = $this->repository->delete($id);
            
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Colaborador não encontrado.'
                ]);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Colaborador deletado com sucesso.'
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao deletar',
                'details' => $e->getMessage()
            ]);
        }
    }
}