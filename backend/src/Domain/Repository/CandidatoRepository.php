<?php

namespace App\Domain\Repository;

use App\Core\Database;

class CandidatoRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }


    public function create($id_usuario, $data)
    {
        $sql = "INSERT INTO candidatos (id_usuario, resumo_profissional, portfolio_url) 
                VALUES (:id_usuario, :resumo, :portfolio)";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([
            ':id_usuario' => $id_usuario,
            ':resumo' => $data['resumo_profissional'] ?? null,
            ':portfolio' => $data['portfolio_url'] ?? null
        ]);

        return $this->db->lastInsertId();
    }
}