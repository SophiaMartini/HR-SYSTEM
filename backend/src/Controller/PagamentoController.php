<?php

namespace App\Controller;

use App\Domain\Repository\PagamentoRepository;
use App\Domain\Repository\RecrutadorRepository;
use App\Domain\Repository\ContrachequeRepository;
use App\Domain\Repository\ColaboradorRepository;  
use Exception;

class PagamentoController
{
    private $repository;
    private $recrutadorRepo;
    private $contrachequeRepo;
    private $colaboradorRepo;

    public function __construct()
    {
        $this->repository = new PagamentoRepository();
        $this->recrutadorRepo = new RecrutadorRepository();
       
        $this->contrachequeRepo = new ContrachequeRepository();
        $this->colaboradorRepo = new ColaboradorRepository();
    }

    
    private function getUsuarioIdLogado()
    {
        if (!isset($_REQUEST['user_payload'])) {
            throw new Exception("Utilizador não autenticado.", 401);
        }
        return $_REQUEST['user_payload']->sub;
    }

   
    private function isRecrutador()
    {
        $id_usuario = $this->getUsuarioIdLogado();
        $recrutador = $this->recrutadorRepo->findByUsuarioId($id_usuario);
        return $recrutador !== false; 
    }

    
    public function getStatusPorContracheque($id_contracheque)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
           
            $id_usuario_logado = $this->getUsuarioIdLogado();
            $contracheque = $this->contrachequeRepo->findById($id_contracheque);
            
            if (!$contracheque) {
                http_response_code(404);
                echo json_encode(['error' => 'Contracheque não encontrado.']);
                return;
            }

            $colaborador = $this->colaboradorRepo->findById($contracheque['id_colaborador']);
            
           
            if (!$this->isRecrutador() && $colaborador['id_usuario'] != $id_usuario_logado) {
                 http_response_code(403);
                 echo json_encode(['error' => 'Acesso negado.']);
                 return;
            }
            
            
            $pagamento = $this->repository->findByContrachequeId($id_contracheque);
            if (!$pagamento) {
                http_response_code(404);
                echo json_encode(['error' => 'Registo de pagamento não encontrado para este contracheque.']);
                return;
            }
            
            echo json_encode($pagamento);

        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    
    public function confirmarPagamento($id_pagamento)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            
            if (!$this->isRecrutador()) {
                http_response_code(403);
                echo json_encode(['error' => 'Acesso negado. Apenas RH pode confirmar pagamentos.']);
                return;
            }

            $pagamento = $this->repository->findById($id_pagamento);
            if (!$pagamento) {
                http_response_code(404);
                echo json_encode(['error' => 'Pagamento não encontrado.']);
                return;
            }

            if ($pagamento['status'] === 'Efetuado') {
                http_response_code(400);
                echo json_encode(['error' => 'Este pagamento já foi efetuado.']);
                return;
            }
            
            
            $data_efetivada = date('Y-m-d H:i:s');
            $this->repository->updateStatus($id_pagamento, 'Efetuado', $data_efetivada);
            
            $pagamentoAtualizado = $this->repository->findById($id_pagamento);
            echo json_encode($pagamentoAtualizado);

        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}