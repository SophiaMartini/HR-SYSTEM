<?php

namespace App\Domain\Repository;
use App\Core\Database;
use PDO;
use PDOException;

class DepartmentRepository{
    private $db;

    public function __construct(){
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAll() {
        $stmt = $this->db->query("SELECT * FROM departamentos");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    
    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM departamentos WHERE id_departamento = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    
    public function create($data) {
        try {
            // Log dos dados recebidos
            error_log("=== DADOS RECEBIDOS NO CREATE ===");
            error_log(print_r($data, true));
            
            $stmt = $this->db->prepare("INSERT INTO departamentos (nome, descricao, localizacao, telefone, sigla) VALUES (:nome, :descricao, :localizacao, :telefone, :sigla)");
            
            $localizacao = isset($data['localizacao']) && trim($data['localizacao']) !== '' 
                ? trim($data['localizacao']) 
                : null;
            
            $params = [
                'nome' => trim($data['nome']), 
                'descricao' => trim($data['descricao']), 
                'localizacao' => $localizacao,
                'telefone' => trim($data['telefone']), 
                'sigla' => trim($data['sigla'])
            ];
            
            // Log dos parâmetros que vão pro banco
            error_log("=== PARÂMETROS PARA INSERT ===");
            error_log(print_r($params, true));
            
            $stmt->execute($params);
            
            $lastId = $this->db->lastInsertId();
            error_log("=== INSERT SUCESSO - ID: $lastId ===");
            
            return $lastId;
            
        } catch (PDOException $e) {
            error_log("=== ERRO NO INSERT ===");
            error_log("Mensagem: " . $e->getMessage());
            error_log("Código: " . $e->getCode());
            throw $e;
        }
    }

    
    public function update($id, $data) {
        try {
            $stmt = $this->db->prepare("UPDATE departamentos SET nome = :nome, descricao = :descricao, localizacao = :localizacao, telefone = :telefone, sigla = :sigla, ativo = :ativo WHERE id_departamento = :id");
            
            $localizacao = isset($data['localizacao']) && trim($data['localizacao']) !== '' 
                ? trim($data['localizacao']) 
                : null;
            
            $stmt->execute([
                'nome' => trim($data['nome']), 
                'descricao' => trim($data['descricao']), 
                'localizacao' => $localizacao,
                'telefone' => trim($data['telefone']), 
                'sigla' => trim($data['sigla']), 
                'ativo' => $data['ativo'], 
                'id' => $id
            ]);
            return $stmt->rowCount();
            
        } catch (PDOException $e) {
            error_log("=== ERRO NO UPDATE ===");
            error_log("Mensagem: " . $e->getMessage());
            throw $e;
        }
    }

    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM departamentos WHERE id_departamento = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount();
    }
}