<?php

namespace App\Controller;

use App\Domain\Repository\PontoRepository;
use App\Service\PontoService;

class PontoController
{
    private $pontoRepository;
    private $pontoService;

    public function __construct()
    {
        $this->pontoRepository = new PontoRepository();
        $this->pontoService = new PontoService();
    }

    public function entrada()
    {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id_colaborador'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'O campo id_colaborador é obrigatório']);
                return;
            }

            $colaboradorId = $data['id_colaborador'];

            if (!$this->pontoRepository->colaboradorExists($colaboradorId)) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Colaborador não encontrado']);
                return;
            }

            $horaAtual = date('H:i:s');
            $registro = $this->pontoRepository->findOrCreateToday($colaboradorId);

            if ($this->pontoRepository->campoJaPreenchido($registro, 'entrada')) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Entrada já foi registrada hoje',
                    'horario_registrado' => $registro['entrada']
                ]);
                return;
            }

            $result = $this->pontoRepository->updateEntrada($registro['id_controle_ponto'], $horaAtual);

            if ($result) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Entrada registrada com sucesso!', 'horario' => $horaAtual]);
                return;
            }

            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro ao registrar entrada']);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro interno', 'details' => $e->getMessage()]);
        }
    }

    public function saidaAlmoco()
    {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id_colaborador'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'O campo id_colaborador é obrigatório']);
                return;
            }

            $colaboradorId = $data['id_colaborador'];
            $horaAtual = date('H:i:s');
            $registro = $this->pontoRepository->findOrCreateToday($colaboradorId);

            if (!$this->pontoRepository->campoJaPreenchido($registro, 'entrada')) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Você precisa registrar a entrada primeiro']);
                return;
            }

            if ($this->pontoRepository->campoJaPreenchido($registro, 'saida_almoco')) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Saída para almoço já foi registrada hoje',
                    'horario_registrado' => $registro['saida_almoco']
                ]);
                return;
            }

            $result = $this->pontoRepository->updateSaidaAlmoco($registro['id_controle_ponto'], $horaAtual);

            if ($result) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Saída para almoço registrada!', 'horario' => $horaAtual]);
                return;
            }

            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro ao registrar saída para almoço']);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro interno', 'details' => $e->getMessage()]);
        }
    }

    public function retornoAlmoco()
    {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id_colaborador'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'O campo id_colaborador é obrigatório']);
                return;
            }

            $colaboradorId = $data['id_colaborador'];
            $horaAtual = date('H:i:s');
            $registro = $this->pontoRepository->findOrCreateToday($colaboradorId);

            if (!$this->pontoRepository->campoJaPreenchido($registro, 'saida_almoco')) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Você precisa registrar a saída para almoço primeiro']);
                return;
            }

            if ($this->pontoRepository->campoJaPreenchido($registro, 'retorno_almoco')) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Retorno do almoço já foi registrado hoje',
                    'horario_registrado' => $registro['retorno_almoco']
                ]);
                return;
            }

            $result = $this->pontoRepository->updateRetornoAlmoco($registro['id_controle_ponto'], $horaAtual);

            if ($result) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Retorno do almoço registrado!', 'horario' => $horaAtual]);
                return;
            }

            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro ao registrar retorno do almoço']);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro interno', 'details' => $e->getMessage()]);
        }
    }

    public function saida()
    {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id_colaborador'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'O campo id_colaborador é obrigatório']);
                return;
            }

            $colaboradorId = $data['id_colaborador'];
            $horaAtual = date('H:i:s');
            $registro = $this->pontoRepository->findOrCreateToday($colaboradorId);

            if (!$this->pontoRepository->campoJaPreenchido($registro, 'retorno_almoco')) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Você precisa registrar o retorno do almoço primeiro']);
                return;
            }

            if ($this->pontoRepository->campoJaPreenchido($registro, 'saida')) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Saída já foi registrada hoje',
                    'horario_registrado' => $registro['saida']
                ]);
                return;
            }

            $result = $this->pontoRepository->updateSaida($registro['id_controle_ponto'], $horaAtual);

            if ($result) {
                $processamento = $this->pontoService->processarPontoDoDia($colaboradorId);
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Saída registrada com sucesso!',
                    'horario' => $horaAtual,
                    'processamento' => $processamento
                ]);
                return;
            }

            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro ao registrar saída']);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro interno', 'details' => $e->getMessage()]);
        }
    }

    public function getAllByColaboradorId($colaboradorId)
    {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            $registros = $this->pontoRepository->getAllByColaborador($colaboradorId);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'colaborador_id' => $colaboradorId,
                'total_registros' => count($registros),
                'registros' => $registros
            ]);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro interno', 'details' => $e->getMessage()]);
        }
    }

    public function processarPontos()
    {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $dataProcessamento = $data['data'] ?? date('Y-m-d');
            
            $resultados = $this->pontoService->processarPontosDoDia($dataProcessamento);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Pontos processados com sucesso!',
                'data' => $dataProcessamento,
                'total_processados' => count($resultados),
                'resultados' => $resultados
            ]);
            
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao processar pontos',
                'details' => $e->getMessage()
            ]);
        }
    }
}