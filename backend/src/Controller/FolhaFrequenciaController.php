<?php

namespace App\Controller;

use App\Domain\Repository\FolhaFrequenciaRepository;
use Exception;

class FolhaFrequenciaController{
    private $repository;

    public function __construct()
    {
        $this->repository = new FolhaFrequenciaRepository();
    }

    private function getUsuarioIdLogado()
    {
        if (!isset($_REQUEST['user_payload'])) {
            throw new Exception("Payload do utilizador não encontrado.", 500);
        }
        return $_REQUEST['user_payload']->sub;
    }

    public function getHistoricoPorColaborador($id_colaborador)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            
            if ($this->getUsuarioIdLogado() != $id_colaborador) {
                http_response_code(403);
                echo json_encode(['error' => 'Acesso negado.']);
                return;
            }

            $historico = $this->repository->findAllByColaborador($id_colaborador);
            echo json_encode($historico);
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getMinhaFrequenciaDoMes(){
        header('Content-Type: application/json; charset=utf-8');
        try {
            
            $id_usuario_logado = $this->getUsuarioIdLogado();

            
            if (empty($_GET['mes'])) {
                http_response_code(400);
                echo json_encode(['error' => "Parâmetro de query 'mes' (AAAA-MM) é obrigatório."]);
                return;
            }

           
            $mes_referencia = $_GET['mes'] . '-01';

            
            $folha = $this->repository->findByUsuarioIdAndMes($id_usuario_logado, $mes_referencia);
            
            if (!$folha) {
                http_response_code(404);
                echo json_encode(['error' => 'Folha de frequência não encontrada para este mês.']);
                return;
            }

            echo json_encode($folha);
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}