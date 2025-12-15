<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class ColaboradorRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    
    public function findAll()
    {
        $sql = "SELECT 
                    c.id_colaborador, c.id_usuario, c.id_cargo, c.id_departamento, 
                    c.data_admissao, c.salario, c.tipo_contrato, c.status,
                    u.nome, u.email, u.cpf
                FROM colaboradores c
                JOIN usuarios u ON c.id_usuario = u.id
                ORDER BY c.id_colaborador DESC";
        
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    
    public function findById($id_colaborador)
    {
        $sql = "SELECT 
                    c.id_colaborador, c.id_usuario, c.id_cargo, c.id_departamento, 
                    c.data_admissao, c.salario, c.tipo_contrato, c.status,
                    u.nome, u.email, u.cpf
                FROM colaboradores c
                JOIN usuarios u ON c.id_usuario = u.id
                WHERE c.id_colaborador = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_colaborador]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByUsuarioId($id_usuario){
        $sql = "SELECT * FROM colaboradores WHERE id_usuario = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_usuario]);
        return $stmt->fetch(PDO::FETCH_ASSOC); 
    }
    
    public function usuarioJaEhColaborador($id_usuario)
    {
        $stmt = $this->db->prepare("SELECT id_colaborador FROM colaboradores WHERE id_usuario = ?");
        $stmt->execute([$id_usuario]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    
    public function usuarioExists($id_usuario)
    {
        $stmt = $this->db->prepare("SELECT 1 FROM usuarios WHERE id = ?");
        $stmt->execute([$id_usuario]);
        return $stmt->fetchColumn() !== false;
    }

    
    public function create($data)
    {
        $sql = "INSERT INTO colaboradores 
                    (id_usuario, id_cargo, id_departamento, data_admissao, salario, tipo_contrato, status) 
                VALUES 
                    (:id_usuario, :id_cargo, :id_departamento, :data_admissao, :salario, :tipo_contrato, :status)";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([
            ':id_usuario' => $data['id_usuario'],
            ':id_cargo' => $data['id_cargo'],
            ':id_departamento' => $data['id_departamento'],
            ':data_admissao' => $data['data_admissao'],
            ':salario' => $data['salario'],
            ':tipo_contrato' => $data['tipo_contrato'],
            ':status' => $data['status'] ?? 'Ativo'
        ]);

        return $this->db->lastInsertId();
    }

    
    public function update($id_colaborador, $data)
    {
        $allowedColumns = ['id_cargo', 'id_departamento', 'salario', 'tipo_contrato', 'status'];

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
        $params[] = $id_colaborador;

        $sql = "UPDATE colaboradores SET $sqlSetString WHERE id_colaborador = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->rowCount();
    }

    
    public function delete($id_colaborador)
    {
        $stmt = $this->db->prepare("DELETE FROM colaboradores WHERE id_colaborador = ?");
        $stmt->execute([$id_colaborador]);
        return $stmt->rowCount();
    }

   
    public function cargoExists($id_cargo)
    {
        $stmt = $this->db->prepare("SELECT 1 FROM cargos WHERE id_cargo = ?");
        $stmt->execute([$id_cargo]);
        return $stmt->fetchColumn() !== false;
    }


    public function departamentoExists($id_departamento)
    {
        $stmt = $this->db->prepare("SELECT 1 FROM departamentos WHERE id_departamento = ?");
        $stmt->execute([$id_departamento]);
        return $stmt->fetchColumn() !== false;
    }
}