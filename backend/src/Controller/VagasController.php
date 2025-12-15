<?php
namespace App\Controller;
use App\Domain\Repository\VagasRepository;
use App\Domain\Repository\CargosRepository;

class VagasController{
    private $repository;
    private $cargosRepository;

    public function __construct(){
        $this->repository = new VagasRepository();
        $this->cargosRepository = new CargosRepository();
    }

    public function getAll(){
        header('Content-Type: application/json; charset=utf-8');
        try{
            $vagas = $this->repository->findAll();
            echo json_encode($vagas);
        } catch(\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getById($id){
        header('Content-Type: application/json; charset=utf-8');
        try{
            $vaga = $this->repository->findById($id);
            if (!$vaga) {
                http_response_code(404);
                echo json_encode(['error' => 'Vaga não encontrada.']);
                return;
            }
            echo json_encode($vaga);
        } catch(\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function create() {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            if (!is_array($data) || empty($data['id_cargo'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Os campos obrigatórios devem ser preenchidos']);
                return;
            }

            $cargo = $this->cargosRepository->findById($data['id_cargo']);
            if (!$cargo) {
                http_response_code(400);
                echo json_encode(['error' => 'O id_cargo recebido no JSON não é válido.']);
                return;
            }

            $newId = $this->repository->create($data);
            http_response_code(201);
            echo json_encode(['id' => $newId, 'message' => 'Vaga criada com sucesso']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function update($id){
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);
        try{
            if (!is_array($data) || empty($data['id_cargo'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Os campos obrigatórios devem ser preenchidos']);
                return;
            }

            $cargo = $this->cargosRepository->findById($data['id_cargo']);
            if (!$cargo) {
                http_response_code(400);
                echo json_encode(['error' => 'O id_cargo recebido no JSON não é válido.']);
                return;
            }

            $affectedRows = $this->repository->update($id, $data);
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Vaga não encontrada.']);
                return;
            }

            http_response_code(200);
            echo json_encode(['id' => $id, 'message' => 'Vaga atualizada com sucesso']);
        } catch(\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function delete($id) {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $affectedRows = $this->repository->delete($id);
            if ($affectedRows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Vaga não encontrada']);
                return;
            }
            http_response_code(200);
            echo json_encode(['message' => 'Vaga deletada.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}