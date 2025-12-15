<?php

namespace App\Controller;

use App\Domain\Repository\FormacaoRepository;
use Exception;

class FormacaoController
{
    private $repository;

    public function __construct()
    {
        $this->repository = new FormacaoRepository();
    }

    private function getUsuarioIdLogado()
    {
        if (!isset($_REQUEST['user_payload'])) {
            throw new Exception("Payload do utilizador não encontrado.", 500);
        }
        return $_REQUEST['user_payload']->sub;
    }

    
    public function getAllByUserId($id_usuario_url)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            
            if ($this->getUsuarioIdLogado() != $id_usuario_url) {
                http_response_code(403); 
                echo json_encode(['error' => 'Acesso negado.']);
                return;
            }
            $formacoes = $this->repository->findAllByUserId($id_usuario_url);
            echo json_encode($formacoes);
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    
    public function create($id_usuario_url)
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            if ($this->getUsuarioIdLogado() != $id_usuario_url) {
                http_response_code(403);
                echo json_encode(['error' => 'Acesso negado.']);
                return;
            }
            if (empty($data['grau_escolaridade']) || empty($data['situacao']) || empty($data['nome_instituicao'])) {
                http_response_code(400); 
                echo json_encode(['error' => 'Campos obrigatórios (grau_escolaridade, situacao, nome_instituicao) não podem estar vazios.']);
                return;
            }

            $newId = $this->repository->create($id_usuario_url, $data);
            $novaFormacao = $this->repository->findById($newId);
            http_response_code(201);
            echo json_encode($novaFormacao);
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

   
    public function update($id_formacao)
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $id_usuario_token = $this->getUsuarioIdLogado();
            $formacao = $this->repository->findById($id_formacao);
            if (!$formacao) {
                http_response_code(404);
                echo json_encode(['error' => 'Formação não encontrada.']);
                return;
            }
            if ($formacao['id_usuario'] != $id_usuario_token) {
                http_response_code(403);
                echo json_encode(['error' => 'Acesso negado. Você não é o dono deste registo.']);
                return;
            }

            $this->repository->update($id_formacao, $data);
            $updatedFormacao = $this->repository->findById($id_formacao);
            http_response_code(200);
            echo json_encode($updatedFormacao);
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

  
    public function delete($id_formacao)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $id_usuario_token = $this->getUsuarioIdLogado();
            $formacao = $this->repository->findById($id_formacao);
            if (!$formacao) {
                http_response_code(404);
                echo json_encode(['error' => 'Formação não encontrada.']);
                return;
            }
            if ($formacao['id_usuario'] != $id_usuario_token) {
                http_response_code(403);
                echo json_encode(['error' => 'Acesso negado.']);
                return;
            }
            $this->repository->delete($id_formacao);
            http_response_code(200);
            echo json_encode(['message' => 'Formação deletada com sucesso.']);
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}