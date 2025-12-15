<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;


class ContratoRepository {
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    // Salva os dados do contrato no banco
    public function create(array $dados) {
        $sql = "INSERT INTO contratos_trabalho (id_colaborador, tipo_contrato, data_inicio, path_documento) 
                VALUES (:id_colaborador, :tipo_contrato, :data_inicio, :path_documento)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':id_colaborador', $dados['id_colaborador']);
        $stmt->bindValue(':tipo_contrato', $dados['tipo_contrato']);
        $stmt->bindValue(':data_inicio', $dados['data_inicio']);
        $stmt->bindValue(':path_documento', $dados['path_documento']);
        
        return $stmt->execute();
    }

    // Busca contratos de um colaborador específico
    public function findByColaboradorId($idColaborador) {
        $sql = "SELECT * FROM contratos_trabalho WHERE id_colaborador = :id_colaborador";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':id_colaborador', $idColaborador);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}