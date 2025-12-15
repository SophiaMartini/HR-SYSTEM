<?php

namespace App\Domain\Repository;
use App\Core\Database; 
use PDO;

class TreinamentoRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAll() {
        $stmt = $this->db->query("SELECT * FROM treinamentos");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM treinamentos WHERE id_treinamento = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

   
    public function create($data) {
        $sql = "INSERT INTO treinamentos (titulo, descricao, carga_horaria, instrutor) 
                VALUES (?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($sql);
        
        
        $params = [
            $data['titulo'],
            $data['descricao'],
            $data['carga_horaria'],
            $data['instrutor']
        ];
        
        $stmt->execute($params);
        return $this->db->lastInsertId();
    }

    
    public function update($id, $data) {
        $allowedColumns = ['titulo', 'descricao', 'carga_horaria', 'instrutor'];
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
        $params[] = $id;
        
        $sql = "UPDATE treinamentos SET $sqlSetString WHERE id_treinamento = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->rowCount();
    }

    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM treinamentos WHERE id_treinamento = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount();
    }
}