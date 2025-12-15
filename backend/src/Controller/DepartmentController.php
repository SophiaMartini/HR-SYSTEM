<?php

namespace App\Controller;

use App\Domain\Repository\DepartmentRepository;
use Exception; 

class DepartmentController{
    private $repository;

    public function __construct()
    {
        $this->repository = new DepartmentRepository();
    }

    public function getAll()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $departments = $this->repository->findAll();
            echo json_encode($departments);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getById($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $department = $this->repository->findById($id);
            if (!$department) {
                http_response_code(404);
                echo json_encode(['error' => 'Departamento não encontrado.']);
                return;
            }
            echo json_encode($department);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function create()
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            // Validação: apenas campos obrigatórios (localizacao é opcional)
            if (!is_array($data) || 
                empty(trim($data['nome'] ?? '')) || 
                empty(trim($data['descricao'] ?? '')) || 
                empty(trim($data['telefone'] ?? '')) || 
                empty(trim($data['sigla'] ?? ''))) {
                http_response_code(400); 
                echo json_encode(['error' => 'Os campos "nome", "descricao", "telefone" e "sigla" são obrigatórios']);
                return;
            }

            $newId = $this->repository->create($data);
            http_response_code(201); 
            $responseData = [
                'id' => $newId,
                'nome' => $data['nome'],
                'descricao' => $data['descricao'],
                'localizacao' => $data['localizacao'] ?? null,
                'telefone' => $data['telefone'],
                'sigla' => $data['sigla']
            ];
            echo json_encode($responseData);

        } catch (Exception $e) {
            // Tratamento específico para nome duplicado
            if (strpos($e->getMessage(), 'Duplicate entry') !== false && strpos($e->getMessage(), 'nome') !== false) {
                http_response_code(409);
                echo json_encode(['error' => 'Já existe um departamento com este nome.']);
                return;
            }
            
            $codigoErro = $e->getCode() ? $e->getCode() : 500;
            http_response_code($codigoErro);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function update($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            // Validação: localizacao é opcional
            if (!is_array($data) || 
                empty(trim($data['nome'] ?? '')) || 
                empty(trim($data['descricao'] ?? '')) || 
                empty(trim($data['telefone'] ?? '')) || 
                empty(trim($data['sigla'] ?? '')) || 
                !isset($data['ativo'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Os campos "nome", "descricao", "telefone", "sigla" e "ativo" são obrigatórios.']);
                return;
            }

            $affectedRows = $this->repository->update($id, $data);
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Departamento não encontrado ou dados idênticos.']);
                return;
            }

            http_response_code(200);
            $responseData = [
                'id' => $id,
                'nome' => $data['nome'],
                'descricao' => $data['descricao'],
                'localizacao' => $data['localizacao'] ?? null,
                'telefone' => $data['telefone'],
                'sigla' => $data['sigla'],
                'ativo' => $data['ativo']
            ];
            echo json_encode($responseData);

        } catch (Exception $e) {
            // Tratamento específico para nome duplicado
            if (strpos($e->getMessage(), 'Duplicate entry') !== false && strpos($e->getMessage(), 'nome') !== false) {
                http_response_code(409);
                echo json_encode(['error' => 'Já existe um departamento com este nome.']);
                return;
            }
            
            $codigoErro = $e->getCode() ? $e->getCode() : 500;
            http_response_code($codigoErro);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function delete($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $affectedRows = $this->repository->delete($id);
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Departamento não encontrado']);
                return;
            }

            http_response_code(200); 
            echo json_encode(['message' => 'Departamento deletado com sucesso.']);
        } catch (Exception $e) {
            $codigoErro = $e->getCode() ? $e->getCode() : 500;
            http_response_code($codigoErro);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}