<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class FormacaoRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAllByUserId($id_usuario)
    {
        $sql = "SELECT * FROM formacoes_academicas WHERE id_usuario = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_usuario]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id_formacao)
    {
        $sql = "SELECT * FROM formacoes_academicas WHERE id_formacao = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_formacao]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($id_usuario, $data)
    {
        $sql = "INSERT INTO formacoes_academicas 
                    (id_usuario, grau_escolaridade, situacao, nome_instituicao, data_inicio, data_conclusao) 
                VALUES 
                    (:id_usuario, :grau, :situacao, :instituicao, :inicio, :conclusao)";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([
            ':id_usuario' => $id_usuario,
            ':grau' => $data['grau_escolaridade'],
            ':situacao' => $data['situacao'],
            ':instituicao' => $data['nome_instituicao'],
            ':inicio' => $data['data_inicio'] ?? null,
            ':conclusao' => $data['data_conclusao'] ?? null
        ]);

        return $this->db->lastInsertId();
    }


    public function update($id_formacao, $data)
    {
        $allowedColumns = ['grau_escolaridade', 'situacao', 'nome_instituicao', 'data_inicio', 'data_conclusao'];
        $setParts = [];
        $params = [];

        foreach ($data as $key => $value) {
            if (in_array($key, $allowedColumns)) {
                $setParts[] = "$key = ?";
                $params[] = $value;
            }
        }
        if (empty($setParts)) return 0;
        $sqlSetString = implode(', ', $setParts);
        $params[] = $id_formacao;
        $sql = "UPDATE formacoes_academicas SET $sqlSetString WHERE id_formacao = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    public function delete($id_formacao)
    {
        $stmt = $this->db->prepare("DELETE FROM formacoes_academicas WHERE id_formacao = ?");
        $stmt->execute([$id_formacao]);
        return $stmt->rowCount();
    }
}