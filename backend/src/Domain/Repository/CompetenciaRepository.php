<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class CompetenciaRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAll()
    {
        $stmt = $this->db->query("SELECT * FROM competencias");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM competencias WHERE id_competencia = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $stmt = $this->db->prepare("INSERT INTO competencias (nome_competencia, descricao) VALUES (?, ?)");
        $stmt->execute([
            $data['nome_competencia'],
            $data['descricao'] ?? null
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data)
    {
        $stmt = $this->db->prepare("UPDATE competencias SET nome_competencia = ?, descricao = ? WHERE id_competencia = ?");
        $stmt->execute([
            $data['nome_competencia'],
            $data['descricao'] ?? null,
            $id
        ]);
        return $stmt->rowCount();
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM competencias WHERE id_competencia = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount();
    }
}