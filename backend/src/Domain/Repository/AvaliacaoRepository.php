<?php

namespace App\Domain\Repository;
use App\Core\Database;
use PDO;

class AvaliacaoRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findById($id_avaliacao) {
        $sql = "SELECT * FROM avaliacoes_desempenho WHERE id_avaliacao = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_avaliacao]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findAllByColaboradorId($id_colaborador){
        $sql = "SELECT * FROM avaliacoes_desempenho WHERE id_colaborador = ? ORDER BY data_avaliacao DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_colaborador]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findAll() {
        $sql = "SELECT * FROM avaliacoes_desempenho ORDER BY data_avaliacao DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($id_avaliador, $dadosAvaliacao){
        $sql = "INSERT INTO avaliacoes_desempenho (id_colaborador, id_avaliador, periodo_avaliacao, nota_final, comentarios_gerais) VALUES (:id_colaborador, :id_avaliador, :periodo_avaliacao, :nota_final, :comentarios_gerais)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id_colaborador' => $dadosAvaliacao['id_colaborador'],
            ':id_avaliador' => $id_avaliador,
            ':periodo_avaliacao' => $dadosAvaliacao['periodo_avaliacao'],
            ':nota_final' => $dadosAvaliacao['nota_final'] ?? null,
            ':comentarios_gerais' => $dadosAvaliacao['comentarios_gerais'] ?? null
        ]);
        $idNovaAvaliacao = $this->db->lastInsertId();
        return $idNovaAvaliacao;
    }

    
}
