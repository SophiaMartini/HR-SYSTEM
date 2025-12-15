<?php
namespace App\Controller;
use App\Domain\Repository\EnderecoRepository;
use App\Domain\Repository\UserRepository;

class EnderecoController{
    private $repository;
    private $userRepository;

    public function __construct(){
        $this->repository = new EnderecoRepository();
        $this->userRepository = new UserRepository();
    }

    public function getAllByUserId($id_usuario){
        header('Content-Type: application/json; charset=utf-8');
        try{
            $usuario = $this->userRepository->findById($id_usuario);
            if (!$usuario) {
                http_response_code(404);
                echo json_encode(['error' => 'Usuário não encontrado.']);
                return;
            }

            $enderecos = $this->repository->findByUserId($id_usuario);
            echo json_encode($enderecos);
        } catch(\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function create($id_usuario) {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $usuario = $this->userRepository->findById($id_usuario);
            if (!$usuario) {
                http_response_code(404);
                echo json_encode(['error' => 'Usuário não encontrado.']);
                return;
            }

            $data['id_usuario'] = $id_usuario;

            $newId = $this->repository->create($data);
            http_response_code(201);
            echo json_encode(['id' => $newId, 'message' => 'Endereço criado com sucesso']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function update($id_usuario){
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);
        try{
            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode(['error' => 'Dados inválidos']);
                return;
            }

            $usuario = $this->userRepository->findById($id_usuario);
            if (!$usuario) {
                http_response_code(404);
                echo json_encode(['error' => 'Usuário não encontrado.']);
                return;
            }

            $enderecos = $this->repository->findByUserId($id_usuario);
            if (empty($enderecos)) {
                http_response_code(404);
                echo json_encode(['error' => 'Endereço não encontrado para este usuário.']);
                return;
            }

            $id_endereco = $enderecos[0]['id_endereco'];
            $affectedRows = $this->repository->update($id_endereco, $data);

            http_response_code(200);
            echo json_encode(['id' => $id_endereco, 'message' => 'Endereço atualizado com sucesso']);
        } catch(\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}