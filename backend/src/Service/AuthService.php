<?php

namespace App\Service;

use App\Core\Database;
use App\Domain\Repository\UserRepository;
use App\Domain\Repository\CandidatoRepository;
use App\Domain\Repository\RecrutadorRepository;
use App\Domain\Repository\ColaboradorRepository;
use App\Domain\Repository\DepartmentRepository;
use PDOException;
use Exception;
use Firebase\JWT\JWT;


class AuthService
{
    private $db;
    private $userRepository;
    private $candidatoRepository;
    private $recrutadorRepository; 
    private $colaboradorRepository;
    private $departmentRepository;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
        $this->userRepository = new UserRepository();
        $this->candidatoRepository = new CandidatoRepository();
        $this->recrutadorRepository = new RecrutadorRepository();
        $this->colaboradorRepository = new ColaboradorRepository();
        $this->departmentRepository = new DepartmentRepository();
    }

    //registo de um novo candidato.
    public function registrarCandidato($data)
    {
        if ($this->userRepository->findByEmail($data['email'])) {
            throw new Exception("Este email já está a ser utilizado.", 409);
        }
        //Criptografar
        $data['senha'] = password_hash($data['senha'], PASSWORD_DEFAULT);
        
        try {
            $this->db->beginTransaction();
            $novoUsuarioId = $this->userRepository->create($data);
            $this->candidatoRepository->create($novoUsuarioId, $data);

            $this->db->commit();

            return $novoUsuarioId;

        } catch (PDOException $e) {
            
            $this->db->rollBack();
            
            throw new Exception("Erro ao registar utilizador no banco de dados: " . $e->getMessage(), 500);
        }
    }

public function login(string $cpf, string $senha)
{
    $sql = "SELECT id, cpf, senha, tipo 
            FROM usuarios 
            WHERE cpf = :cpf
            LIMIT 1";

    $stmt = $this->pdo->prepare($sql);
    $stmt->bindParam(':cpf', $cpf);
    $stmt->execute();

    $user = $stmt->fetch(\PDO::FETCH_ASSOC);

    if (!$user) {
        return false;
    }

    if (!password_verify($senha, $user['senha'])) {
        return false;
    }

    return $user;
}

    public function registrarRecrutador($data){
        if (empty($data['id_departamento']) || !$this->departmentRepository->findById($data['id_departamento'])) {
             throw new Exception("Departamento inválido ou não fornecido.", 400); 
        }
        try {
            $this->db->beginTransaction();

            $usuario = $this->userRepository->findByEmail($data['email']);
            $userId = null;

            if ($usuario) {
                // Usuário existe, verificar se já é recrutador
                $recrutador = $this->recrutadorRepository->findByUsuarioId($usuario['id']);
                if ($recrutador) {
                    throw new Exception("Este utilizador já é um recrutador.", 409);
                }
                $userId = $usuario['id'];
            } else {
                // Usuário não existe, criar um novo
                $data['senha'] = password_hash($data['senha'], PASSWORD_DEFAULT);
                $userId = $this->userRepository->create($data);
            }

            // Criar o registro de recrutador
            $this->recrutadorRepository->create($userId, $data);

            $this->db->commit();

            return $userId;

        } catch (Exception $e) {
            $this->db->rollBack();
            throw new Exception("Erro ao registar recrutador no banco de dados: " . $e->getMessage(), 500);
        }
    }
}