<?php

namespace App\Controller;

use App\Domain\Repository\ContrachequeRepository;
use App\Service\PagamentoService;

class ContrachequeController
{
    private $repository;
    private $pagamentoService;

    public function __construct()
    {
        $this->repository = new ContrachequeRepository();
        $this->pagamentoService = new PagamentoService();
    }

    public function getAll()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $contracheques = $this->repository->findAll();
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'total' => count($contracheques),
                'data' => $contracheques
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao buscar contracheques',
                'details' => $e->getMessage()
            ]);
        }
    }

    public function getById($id)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $contracheque = $this->repository->findById($id);
            
            if (!$contracheque) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Contracheque não encontrado'
                ]);
                return;
            }

            $lancamentos = $this->repository->getLancamentosByContracheque($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => [
                    'contracheque' => $contracheque,
                    'lancamentos' => $lancamentos
                ]
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao buscar contracheque',
                'details' => $e->getMessage()
            ]);
        }
    }

    public function getByColaboradorId($colaboradorId)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $contracheques = $this->repository->findByColaborador($colaboradorId);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'colaborador_id' => $colaboradorId,
                'total' => count($contracheques),
                'data' => $contracheques
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao buscar contracheques do colaborador',
                'details' => $e->getMessage()
            ]);
        }
    }

    public function downloadPDF($id)
    {
        try {
            $contracheque = $this->repository->findById($id);
            
            if (!$contracheque) {
                http_response_code(404);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'success' => false,
                    'error' => 'Contracheque não encontrado'
                ]);
                return;
            }

            $lancamentos = $this->repository->getLancamentosByContracheque($id);

            $pdfContent = $this->pagamentoService->gerarPDF($contracheque, $lancamentos);

            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment; filename="contracheque_' . $id . '.pdf"');
            echo $pdfContent;

        } catch (\Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao gerar PDF',
                'details' => $e->getMessage()
            ]);
        }
    }
}