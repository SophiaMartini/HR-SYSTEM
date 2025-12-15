<?php

namespace App\Controller;

use App\Domain\Repository\CandidaturaRepository;
use App\Domain\Repository\RecrutadorRepository;
use App\Service\FileUploadService;
use Exception;

class CandidaturaController
{
    private $repository;
    private $recrutadorRepository;
    private $fileService;

    public function __construct()
    {
        $this->repository = new CandidaturaRepository();
        $this->recrutadorRepository = new RecrutadorRepository();
        $this->fileService = new FileUploadService();
    }

 
    public function getCandidaturasPorVaga($id_vaga)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $candidaturas = $this->repository->findAllByVaga($id_vaga);
            echo json_encode($candidaturas);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }


    public function getById($id_candidatura)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $candidatura = $this->repository->findById($id_candidatura);
            if (!$candidatura) {
                http_response_code(404);
                echo json_encode(['error' => 'Candidatura não encontrada.']);
                return;
            }
            echo json_encode($candidatura);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }


    public function create($id_vaga)
    {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            if (!isset($_REQUEST['user_payload'])) {
                throw new Exception("Payload do utilizador não encontrado. O middleware falhou?", 500);
            }
            $payload = $_REQUEST['user_payload'];
            $id_candidato = $payload->sub; 

            if (!isset($_FILES['curriculo']) || $_FILES['curriculo']['error'] == UPLOAD_ERR_NO_FILE) {
                throw new Exception("O ficheiro do currículo é obrigatório.", 400);
            }
            $file = $_FILES['curriculo'];
            $path_curriculo = $this->fileService->upload($file);

            $data = [
                'id_vaga' => $id_vaga,
                'id_candidato' => $id_candidato,
                'path_curriculo' => $path_curriculo
            ];
            $newId = $this->repository->create($data);
            $novaCandidatura = $this->repository->findById($newId);
            http_response_code(201);
            echo json_encode($novaCandidatura);

        } catch (Exception $e) {
            $codigoErro = $e->getCode() ? $e->getCode() : 500;
            http_response_code($codigoErro);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }


    public function mudarStatus($id_candidatura)
    {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            
            if (!isset($_REQUEST['user_payload'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Autenticação necessária.']);
                return;
            }
            
            $payload = $_REQUEST['user_payload'];
            $id_usuario = $payload->sub;
            
            // Verifica se o usuário existe na tabela de recrutadores
            $recrutador = $this->recrutadorRepository->findByUsuarioId($id_usuario);
            
            if (!$recrutador) {
                http_response_code(403);
                echo json_encode(['error' => 'Acesso negado. Apenas recrutadores podem alterar o status.']);
                return;
            }

            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            if (!isset($data['status'])) {
                throw new Exception("O campo 'status' é obrigatório.", 400);
            }

            $novoStatus = $data['status'];

            $statusValidos = ['Em Análise', 'Em Entrevista', 'Aprovado', 'Rejeitado'];
            if (!in_array($novoStatus, $statusValidos)) {
                throw new Exception("Status inválido. Valores permitidos: " . implode(', ', $statusValidos), 400);
            }

            
            $sucesso = $this->repository->updateStatus($id_candidatura, $novoStatus);
            
            if (!$sucesso) {
                http_response_code(404);
                echo json_encode(['error' => 'Candidatura não encontrada.']);
                return;
            }

            
            $candidaturaAtualizada = $this->repository->findById($id_candidatura);
            echo json_encode($candidaturaAtualizada);

        } catch (Exception $e) {
            $codigoErro = $e->getCode() ? $e->getCode() : 500;
            http_response_code($codigoErro);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}