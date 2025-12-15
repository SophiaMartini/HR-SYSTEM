<?php
namespace App\Controller;
use App\Domain\Repository\ExperienciaRepository;
use Exception;

class ExperienciaController{
    private $repository;
    public function __construct(){
        $this->repository = new ExperienciaRepository();
    }

    private function getUsuarioIdLogado(){
        if (!isset($_REQUEST['user_payload'])) {
            throw new Exception("Payload do utilizador não encontrado. O middleware falhou?", 500);
        }
        return $_REQUEST['user_payload']->sub;
    }

    public function getAllByUserId($id_usuario_url){
        header('Content-Type: application/json; charset=utf-8');
        try {
            $id_usuario_token = $this->getUsuarioIdLogado();
            
            
            if ($id_usuario_token != $id_usuario_url) {
                http_response_code(403);// 403 Forbidden (Proibido)
                echo json_encode(['error' => 'Acesso negado. Você só pode ver o seu próprio perfil.']);
                return;
            }

            $experiencias = $this->repository->findAllByUserId($id_usuario_url);
            echo json_encode($experiencias);

        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    public function create($id_usuario_url){
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            $id_usuario_token = $this->getUsuarioIdLogado();
            
            
            if ($id_usuario_token != $id_usuario_url) {
                http_response_code(403); 
                echo json_encode(['error' => 'Acesso negado. Você só pode adicionar ao seu próprio perfil.']);
                return;
            }

            if (empty($data['empresa']) || empty($data['cargo']) || empty($data['data_admissao'])) {
                http_response_code(400); 
                echo json_encode(['error' => 'Campos obrigatórios (empresa, cargo, data_admissao) não podem estar vazios.']);
                return;
            }
            $newId = $this->repository->create($id_usuario_url, $data);
            $novaExperiencia = $this->repository->findById($newId); 

            http_response_code(201); 
            echo json_encode($novaExperiencia);

        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    public function update($id_experiencia){
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            $id_usuario_token = $this->getUsuarioIdLogado();

            
            $experiencia = $this->repository->findById($id_experiencia);

            if (!$experiencia) {
                http_response_code(404); 
                echo json_encode(['error' => 'Experiência não encontrada.']);
                return;
            }
            if ($experiencia['id_usuario'] != $id_usuario_token) {
                http_response_code(403); 
                echo json_encode(['error' => 'Acesso negado. Você não é o dono desta experiência.']);
                return;
            }

        
            $affectedRows = $this->repository->update($id_experiencia, $data);
            
          
            $updatedExperiencia = $this->repository->findById($id_experiencia);
            http_response_code(200);
            echo json_encode($updatedExperiencia);

        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function delete($id_experiencia){
        header('Content-Type: application/json; charset=utf-8');
        try {
            $id_usuario_token = $this->getUsuarioIdLogado();

            
            $experiencia = $this->repository->findById($id_experiencia);

            if (!$experiencia) {
                http_response_code(404);
                echo json_encode(['error' => 'Experiência não encontrada.']);
                return;
            }
            if ($experiencia['id_usuario'] != $id_usuario_token) {
                http_response_code(403); 
                echo json_encode(['error' => 'Acesso negado. Você não é o dono desta experiência.']);
                return;
            }

        
            $this->repository->delete($id_experiencia);
            http_response_code(200);
            echo json_encode(['message' => 'Experiência deletada com sucesso.']);
            
        } catch (Exception $e) {
            http_response_code($e->getCode() ? $e->getCode() : 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}