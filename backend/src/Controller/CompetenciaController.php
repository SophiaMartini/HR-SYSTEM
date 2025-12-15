<?php

namespace App\Controller;

use App\Domain\Repository\CompetenciaRepository;

class CompetenciaController
{
    private $repository;

    public function __construct()
    {
        $this->repository = new CompetenciaRepository();
    }

    public function getAll()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $competencias = $this->repository->findAll();
            echo json_encode($competencias);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getById($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $competencia = $this->repository->findById($id);
            if (!$competencia) {
                http_response_code(404);
                echo json_encode(['error' => 'Competência não encontrada.']);
                return;
            }
            echo json_encode($competencia);
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
            if (!is_array($data) || empty(trim($data['nome_competencia'] ?? ''))) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "nome_competencia" é obrigatório']);
                return;
            }

            $newId = $this->repository->create($data);
            
            
            $competencia = $this->repository->findById($newId);
            
            http_response_code(201);
            echo json_encode($competencia);

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
            if (!is_array($data) || empty(trim($data['nome_competencia'] ?? ''))) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "nome_competencia" é obrigatório.']);
                return;
            }

            $affectedRows = $this->repository->update($id, $data);
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Competência não encontrada.']);
                return;
            }

            
            $competencia = $this->repository->findById($id);
            
            http_response_code(200);
            echo json_encode($competencia);

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
                echo json_encode(['error' => 'Competência não encontrada']);
                return;
            }

            http_response_code(200);
            echo json_encode(['message' => 'Competência deletada.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}