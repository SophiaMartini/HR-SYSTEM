<?php

namespace App\Controller;

use App\Domain\Repository\CargosRepository;

class CargosController
{
    private $repository;

    public function __construct()
    {
        $this->repository = new CargosRepository();
    }

    public function getAll()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $cargos = $this->repository->findAll();
            echo json_encode($cargos);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getById($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $cargo = $this->repository->findById($id);
            if (!$cargo) {
                http_response_code(404);
                echo json_encode(['error' => 'Cargo não encontrado.']);
                return;
            }
            echo json_encode($cargo);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function create()
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            if (!is_array($data) || empty(trim($data['titulo'] ?? ''))) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "titulo" é obrigatório']);
                return;
            }

            if (empty($data['id_departamento'])) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "id_departamento" é obrigatório']);
                return;
            }

            if (!$this->repository->departmentExists($data['id_departamento'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Departamento não encontrado']);
                return;
            }

            $newId = $this->repository->create($data);
            $cargo = $this->repository->findById($newId);
            
            http_response_code(201);
            echo json_encode($cargo);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function update($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            if (!is_array($data) || empty(trim($data['titulo'] ?? ''))) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "titulo" é obrigatório']);
                return;
            }

            if (empty($data['id_departamento'])) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "id_departamento" é obrigatório']);
                return;
            }

            if (!$this->repository->departmentExists($data['id_departamento'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Departamento não encontrado']);
                return;
            }

            $affectedRows = $this->repository->update($id, $data);
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Cargo não encontrado.']);
                return;
            }

            $cargo = $this->repository->findById($id);
            
            http_response_code(200);
            echo json_encode($cargo);

        } catch (\Exception $e) {
            http_response_code(500);
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
                echo json_encode(['error' => 'Cargo não encontrado']);
                return;
            }

            http_response_code(200);
            echo json_encode(['message' => 'Cargo deletado.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}