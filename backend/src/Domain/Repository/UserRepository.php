<?php

namespace App\Domain\Repository;
use App\Core\Database; 
use PDO;

class UserRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByEmail($email)
    {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByCpf($cpf)
    {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE cpf = ?");
        $stmt->execute([$cpf]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $sql = "INSERT INTO usuarios (nome, email, senha, cpf, data_nascimento, celular, estado_civil,
                nacionalidade, naturalidade_estado, naturalidade_cidade, genero, possui_deficiencia) 
                VALUES (:nome, :email, :senha, :cpf, :data_nascimento, :celular, :estado_civil,
                 :nacionalidade, :naturalidade_estado, :naturalidade_cidade, :genero, 
                 :possui_deficiencia)";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([
            ':nome' => $data['nome'],
            ':email' => $data['email'],
            ':senha' => $data['senha'],
            ':cpf' => $data['cpf'], 
            ':data_nascimento' => $data['data_nascimento'] ?? null,
            ':celular' => $data['celular'] ?? null,
            ':estado_civil' => $data['estado_civil'] ?? null,
            ':nacionalidade' => $data['nacionalidade'] ?? null,
            ':naturalidade_estado' => $data['naturalidade_estado'] ?? null,
            ':naturalidade_cidade' => $data['naturalidade_cidade'] ?? null,
            ':genero' => $data['genero'] ?? null,
            ':possui_deficiencia' => $data['possui_deficiencia'] ?? 0
        ]);

        return $this->db->lastInsertId();
    }
}