<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class RecrutadorRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($id_usuario, $data)
    {
        $sql = "INSERT INTO recrutadores (id_usuario, id_departamento, certificacoes) 
                VALUES (:id_usuario, :id_departamento, :certificacoes)";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([
            ':id_usuario' => $id_usuario,
            ':id_departamento' => $data['id_departamento'],
            ':certificacoes' => $data['certificacoes'] ?? null
        ]);

        return $this->db->lastInsertId();
    }

    public function findByUsuarioId($id_usuario)
    {
        $sql = "SELECT * FROM recrutadores WHERE id_usuario = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_usuario]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}