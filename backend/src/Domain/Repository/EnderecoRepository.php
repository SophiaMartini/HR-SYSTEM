<?php

namespace App\Domain\Repository;
use App\Core\Database;
use PDO;

class EnderecoRepository{
    private $db;

    public function __construct(){
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByUserId($id_usuario) {
        $stmt = $this->db->prepare("SELECT * FROM enderecos WHERE id_usuario = ?");
        $stmt->execute([$id_usuario]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO enderecos (id_usuario, cep, endereco, numero, complemento, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['id_usuario'],
            $data['cep'],
            $data['endereco'],
            $data['numero'],
            $data['complemento'] ?? null,
            $data['bairro'],
            $data['cidade'],
            $data['estado']
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE enderecos SET cep = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ? WHERE id_endereco = ?");
        $stmt->execute([
            $data['cep'],
            $data['endereco'],
            $data['numero'],
            $data['complemento'] ?? null,
            $data['bairro'],
            $data['cidade'],
            $data['estado'],
            $id
        ]);
        return $stmt->rowCount();
    }
}