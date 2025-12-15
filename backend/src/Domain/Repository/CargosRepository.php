<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class CargosRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAll()
    {
        $stmt = $this->db->query("SELECT * FROM cargos");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM cargos WHERE id_cargo = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $stmt = $this->db->prepare("INSERT INTO cargos (id_departamento, titulo, descricao) VALUES (?, ?, ?)");
        $stmt->execute([
            $data['id_departamento'],
            $data['titulo'],
            $data['descricao'] ?? null
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data)
    {
        $stmt = $this->db->prepare("UPDATE cargos SET id_departamento = ?, titulo = ?, descricao = ? WHERE id_cargo = ?");
        $stmt->execute([
            $data['id_departamento'],
            $data['titulo'],
            $data['descricao'] ?? null,
            $id
        ]);
        return $stmt->rowCount();
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM cargos WHERE id_cargo = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount();
    }

    public function departmentExists($id_departamento)
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM departamentos WHERE id_departamento = ?");
        $stmt->execute([$id_departamento]);
        return $stmt->fetchColumn() > 0;
    }
}