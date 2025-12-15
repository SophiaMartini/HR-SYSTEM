<?php

namespace App\Controller;

use App\Domain\Repository\RubricaRepository;

class RubricaController
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RubricaRepository();
    }

    public function getAll()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $rubricas = $this->repository->findAll();
            echo json_encode($rubricas);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getById($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $rubrica = $this->repository->findById($id);
            if (!$rubrica) {
                http_response_code(404);
                echo json_encode(['error' => 'Rubrica não encontrada.']);
                return;
            }
            echo json_encode($rubrica);
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
            if (!is_array($data) || empty(trim($data['codigo'] ?? ''))) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "codigo" é obrigatório']);
                return;
            }

            if (empty(trim($data['tipo'] ?? ''))) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "tipo" é obrigatório']);
                return;
            }

            if (!in_array($data['tipo'], ['Provento', 'Desconto'])) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "tipo" deve ser "Provento" ou "Desconto"']);
                return;
            }

            $newId = $this->repository->create($data);
            $rubrica = $this->repository->findById($newId);
            
            http_response_code(201);
            echo json_encode($rubrica);

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
            if (!is_array($data) || empty(trim($data['codigo'] ?? ''))) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "codigo" é obrigatório']);
                return;
            }

            if (empty(trim($data['tipo'] ?? ''))) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "tipo" é obrigatório']);
                return;
            }

            if (!in_array($data['tipo'], ['Provento', 'Desconto'])) {
                http_response_code(400);
                echo json_encode(['error' => 'O campo "tipo" deve ser "Provento" ou "Desconto"']);
                return;
            }

            $affectedRows = $this->repository->update($id, $data);
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Rubrica não encontrada.']);
                return;
            }

            $rubrica = $this->repository->findById($id);
            
            http_response_code(200);
            echo json_encode($rubrica);

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
                echo json_encode(['error' => 'Rubrica não encontrada']);
                return;
            }

            http_response_code(200);
            echo json_encode(['message' => 'Rubrica deletada.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function gerarFolhaPagamento()
    {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $competencia = $data['mes'] ?? date('Y-m');
            
            if (!preg_match('/^\d{4}-\d{2}$/', $competencia)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Formato de competência inválido. Use YYYY-MM (ex: 2025-11)'
                ]);
                return;
            }

            $pagamentoService = new \App\Service\PagamentoService();
            $resultado = $pagamentoService->gerarFolhaPagamento($competencia);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Folha de pagamento processada!',
                'competencia' => $competencia,
                'total_sucesso' => count($resultado['sucesso']),
                'total_erros' => count($resultado['erros']),
                'detalhes' => $resultado
            ]);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao gerar folha de pagamento',
                'details' => $e->getMessage()
            ]);
        }
    }
}