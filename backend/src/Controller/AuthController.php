<?php

namespace App\Controller;

use App\Service\AuthService;
use Exception;

class AuthController {
    private $authService;
    public function __construct()
    {
        $this->authService = new AuthService();
    }
    public function registrarCandidato()
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            
            if (empty($data['nome']) || empty($data['email']) || empty($data['senha']) || empty($data['cpf'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Campos obrigatórios (nome, email, senha, cpf) não podem estar vazios.']);
                return;
            }

            $novoId = $this->authService->registrarCandidato($data);

            http_response_code(201);
            echo json_encode([
                'message' => 'Candidato registado com sucesso!',
                'id_usuario' => $novoId
            ]);
        } catch (Exception $e) {
            $codigoErro = ($e->getCode() == 409 || $e->getCode() == 500) ? $e->getCode() : 500;
            
            http_response_code($codigoErro);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
     public function login()
    {
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents("php://input"), true);

        $cpf = $data['cpf'] ?? null;
        $senha = $data['senha'] ?? null;

        if (!$cpf || !$senha) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Dados inválidos'
            ]);
            return;
        }

        $user = $this->authService->login($cpf, $senha);

        if (!$user) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Email ou senha incorretos'
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'id' => $user['id'],
            'tipo' => $user['tipo']
        ]);
    }
}catch (Exception $e) {
            $errorCode = $e->getCode() ? $e->getCode() : 500;
            http_response_code($errorCode);
            echo json_encode(['error'=> $e->getMessage()]);
        }
    }
    public function registrarRecrutador()
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            
            if (empty($data['nome']) || empty($data['email']) || empty($data['senha']) || empty($data['cpf']) || empty($data['id_departamento'])) {
                http_response_code(400); 
                echo json_encode(['error' => 'Campos obrigatórios (nome, email, senha, cpf, id_departamento) não podem estar vazios.']);
                return;
            }
            $novoId = $this->authService->registrarRecrutador($data);

          
            http_response_code(201);
            echo json_encode([
                'message' => 'Recrutador registado com sucesso!',
                'id_usuario' => $novoId
            ]);

        } catch (Exception $e) {

            $codigoErro = $e->getCode() ? $e->getCode() : 500;
            http_response_code($codigoErro);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
