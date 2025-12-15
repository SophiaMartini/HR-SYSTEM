<?php

namespace App\Domain\Repository;
use App\Core\Database;
use PDO;

class VagasRepository{
    private $db;

    public function __construct(){
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAll() {
        $stmt = $this->db->query("SELECT * FROM vagas");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM vagas WHERE id_vaga = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO vagas (id_cargo, titulo, descricao, requisitos, tipo_contratacao, localizacao, status, data_publicacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['id_cargo'],
            $data['titulo'],
            $data['descricao'],
            $data['requisitos'],
            $data['tipo_contratacao'],
            $data['localizacao'],
            $data['status'],
            $data['data_publicacao']
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE vagas SET id_cargo = ?, titulo = ?, descricao = ?, requisitos = ?, tipo_contratacao = ?, localizacao = ?, status = ?, data_publicacao = ? WHERE id_vaga = ?");
        $stmt->execute([
            $data['id_cargo'],
            $data['titulo'],
            $data['descricao'],
            $data['requisitos'],
            $data['tipo_contratacao'],
            $data['localizacao'],
            $data['status'],
            $data['data_publicacao'],
            $id
        ]);
        return $stmt->rowCount();
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM vagas WHERE id_vaga = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount();
    }
}