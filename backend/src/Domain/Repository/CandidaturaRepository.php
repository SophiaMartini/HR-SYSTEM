<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class CandidaturaRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    
    public function create($data)
    {
        $sql = "INSERT INTO candidaturas (id_vaga, id_candidato, path_curriculo, status) 
                VALUES (:id_vaga, :id_candidato, :path, 'Recebido')";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([
            ':id_vaga' => $data['id_vaga'],
            ':id_candidato' => $data['id_candidato'], 
            ':path' => $data['path_curriculo']
        ]);

        return $this->db->lastInsertId();
    }

    
    public function findAllByVaga($id_vaga)
    {
    
        $sql = "SELECT c.*, u.nome as nome_candidato, u.email as email_candidato
                FROM candidaturas c
                JOIN usuarios u ON c.id_candidato = u.id
                WHERE c.id_vaga = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_vaga]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    
    public function findById($id_candidatura)
    {
        $sql = "SELECT c.*, u.nome as nome_candidato, u.email as email_candidato
                FROM candidaturas c
                JOIN usuarios u ON c.id_candidato = u.id
                WHERE c.id_candidatura = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_candidatura]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    
    public function updateStatus($id_candidatura, $status)
    {
        $sql = "UPDATE candidaturas 
                SET status = :status 
                WHERE id_candidatura = :id_candidatura";
        
        $stmt = $this->db->prepare($sql);
        
        $resultado = $stmt->execute([
            ':status' => $status,
            ':id_candidatura' => $id_candidatura
        ]);

        return $resultado && $stmt->rowCount() > 0;
    }
}