<?php

namespace App\Controller;

use App\Domain\Repository\InscricaoTreinamentoRepository;
use App\Domain\Repository\ColaboradorRepository;
use Exception;

class InscricaoTreinamentoController{
    private $repository;
    private $colaboradorRepository;

    public function __construct(){
        $this->repository = new InscricaoTreinamentoRepository();
        $this->colaboradorRepository = new ColaboradorRepository();
    }

  
    private function getUsuarioIdLogado(){
        if (!isset($_REQUEST['user_payload'])) {
            throw new Exception("Payload do utilizador não encontrado. O middleware falhou.", 401);
        }
        return $_REQUEST['user_payload']->sub;
    }

    
    private function getColaboradorIdDoToken(){
        $id_usuario = $this->getUsuarioIdLogado();
        $colaborador = $this->colaboradorRepository->findByUsuarioId($id_usuario);
        
        if (!$colaborador) {
            throw new Exception("Ação não permitida. Este utilizador não é um colaborador.", 403);
        }
        return $colaborador['id_colaborador'];
    }

    
    public function getMinhasInscricoes(){
        header('Content-Type: application/json; charset=utf-8');
        try {
            $id_colaborador = $this->getColaboradorIdDoToken();
            $inscricoes = $this->repository->findAllByColaborador($id_colaborador);
            echo json_encode($inscricoes);
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    
    public function create($id_treinamento){
        header('Content-Type: application/json; charset=utf-8');
        try {
            $id_colaborador = $this->getColaboradorIdDoToken();
            
            

            $newId = $this->repository->create($id_colaborador, $id_treinamento);
            $novaInscricao = $this->repository->findById($newId);
            
            http_response_code(201);
            echo json_encode($novaInscricao);

        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

   
    public function delete($id_inscricao){
        header('Content-Type: application/json; charset=utf-8');
        try {
            
            $id_colaborador_logado = $this->getColaboradorIdDoToken();
            
            $inscricao = $this->repository->findById($id_inscricao);
            if (!$inscricao) {
                http_response_code(404);
                echo json_encode(['error' => 'Inscrição não encontrada.']);
                return;
            }
            if ($inscricao['id_colaborador'] != $id_colaborador_logado) {
                http_response_code(403); 
                echo json_encode(['error' => 'Acesso negado. Você não é o dono desta inscrição.']);
                return;
            }

            $this->repository->delete($id_inscricao);
            http_response_code(200);
            echo json_encode(['message' => 'Inscrição cancelada com sucesso.']);
            
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
        
    public function getInscritosPorTreinamento($id_treinamento){
        header('Content-Type: application/json; charset=utf-8');
        try {
            $inscritos = $this->repository->findAllByTreinamento($id_treinamento);
            echo json_encode($inscritos);
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}