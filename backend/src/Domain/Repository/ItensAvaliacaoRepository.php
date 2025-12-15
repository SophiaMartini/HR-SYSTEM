<?php

namespace App\Domain\Repository;
use App\Core\Database;
use PDO;

class ItensAvaliacaoRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }


    public function findAllByAvaliacaoId($id_avaliacao){
        $sql = "SELECT * FROM itens_avaliacao WHERE id_avaliacao = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_avaliacao]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($idNovaAvaliacao, $item){
        $sql = "INSERT INTO itens_avaliacao (id_avaliacao, id_competencia, nota, observacoes) VALUES 
        (:id_avaliacao, :id_competencia, :nota, :observacoes)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id_avaliacao' => $idNovaAvaliacao,
            ':id_competencia' => $item['id_competencia'],
            ':nota' => $item['nota'] ?? null,
            ':observacoes' => $item['observacoes'] ?? null
        ]);
        
    }
    
}
