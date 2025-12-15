<?php

namespace App\Domain\Repository;
use App\Core\Database;
use PDO;

class ExperienciaRepository{
    private $db;
    public function __construct(){
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAllByUserId($id_usuario){
        $sql = "SELECT * FROM experiencias_profissionais WHERE id_usuario = ?";
        $stmt = $this->db->prepare($sql);
        $stmt ->execute([$id_usuario]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id_experiencia){
        $sql = "SELECT * FROM experiencias_profissionais WHERE id_experiencia = ?";
        $stmt = $this->db->prepare($sql);
        $stmt ->execute([$id_experiencia]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function create($id_usuario, $data){
        $sql = "INSERT INTO experiencias_profissionais 
                    (id_usuario, empresa, cargo, emprego_atual, data_admissao, 
                    data_demissao, descricao_atividades) 
                VALUES 
                    (:id_usuario, :empresa, :cargo, :emprego_atual, :data_admissao,
                    :data_demissao, :descricao)";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([
            ':id_usuario' => $id_usuario,
            ':empresa' => $data['empresa'],
            ':cargo' => $data['cargo'],
            ':emprego_atual' => $data['emprego_atual'] ?? false,
            ':data_admissao' => $data['data_admissao'],
            ':data_demissao' => $data['data_demissao'] ?? null,
            ':descricao' => $data['descricao_atividades'] ?? null
        ]);

        return $this->db->lastInsertId();
    }

    public function update($id_experiencia, $data){
        $allowedColumns = ['empresa', 'cargo', 'emprego_atual', 'data_admissao', 'data_demissao',
        'descricao_atividades'];

        $setParts = [];
        $params = [];

        foreach ($data as $key => $value) {
            if (in_array($key, $allowedColumns)) {
                $setParts[] = "$key = ?";
                $params[] = $value;
            }
        }

        if (empty($setParts)) {
            return 0; 
        }

        $sqlSetString = implode(', ', $setParts);
        $params[] = $id_experiencia; 

        $sql = "UPDATE experiencias_profissionais SET $sqlSetString WHERE id_experiencia = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->rowCount();
    }
    public function delete($id_experiencia){
        $stmt = $this->db->prepare("DELETE FROM experiencias_profissionais WHERE id_experiencia = ?");
        $stmt->execute([$id_experiencia]);
        return $stmt->rowCount();
    }
}