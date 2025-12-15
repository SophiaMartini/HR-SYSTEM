<?php

namespace App\Controller;
use App\Domain\Repository\TreinamentoRepository;
class TreinamentoController
{
    private $repository;

    public function __construct()
    {
        $this->repository = new TreinamentoRepository();
    }

    public function getAll()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $treinamentos = $this->repository->findAll();
            echo json_encode($treinamentos);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getById($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $treinamento = $this->repository->findById($id);
            if (!$treinamento) {
                http_response_code(404);
                echo json_encode(['error' => 'Treinamento não encontrado.']);
                return;
            }
            echo json_encode($treinamento);
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
            if (
                empty($data['titulo']) ||
                empty($data['descricao']) ||
                empty($data['carga_horaria']) ||
                empty($data['instrutor'])
            ) {
                http_response_code(400); // Bad Request
                echo json_encode(['error' => 'Todos os campos (titulo, descricao, carga_horaria, instrutor) são obrigatórios.']);
                return;
            }

            $newId = $this->repository->create($data);
            
            
            $responseData = [
                'id_treinamento' => $newId,
                'titulo' => $data['titulo'],
                'descricao' => $data['descricao'],
                'carga_horaria' => $data['carga_horaria'],
                'instrutor' => $data['instrutor']
            ];

            http_response_code(201);
            echo json_encode($responseData);

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
            if (empty($data)) {
                http_response_code(400);
                echo json_encode(['error' => 'Nenhum dado enviado para atualização.']);
                return;
            }

            $affectedRows = $this->repository->update($id, $data);
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Treinamento não encontrado ou nenhum dado foi alterado.']);
                return;
            }
            
            $updatedTreinamento = $this->repository->findById($id);
            http_response_code(200);
            echo json_encode($updatedTreinamento);

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
                echo json_encode(['error' => 'Treinamento não encontrado.']);
                return;
            }

            http_response_code(200);
            echo json_encode(['message' => 'Treinamento deletado com sucesso.']);
            
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}