<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class RubricaRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAll()
    {
        $stmt = $this->db->query("SELECT * FROM rubricas");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM rubricas WHERE id_rubrica = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $stmt = $this->db->prepare("INSERT INTO rubricas (codigo, descricao, tipo) VALUES (?, ?, ?)");
        $stmt->execute([
            $data['codigo'],
            $data['descricao'] ?? null,
            $data['tipo']
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data)
    {
        $stmt = $this->db->prepare("UPDATE rubricas SET codigo = ?, descricao = ?, tipo = ? WHERE id_rubrica = ?");
        $stmt->execute([
            $data['codigo'],
            $data['descricao'] ?? null,
            $data['tipo'],
            $id
        ]);
        return $stmt->rowCount();
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM rubricas WHERE id_rubrica = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount();
    }
}