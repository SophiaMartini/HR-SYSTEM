<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class FolhaFrequenciaRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByColaboradorAndMes($id_colaborador, $mes_referencia){
        $sql = "SELECT * FROM folha_frequencia 
                WHERE id_colaborador = ? AND mes_referencia = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_colaborador, $mes_referencia]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function findByUsuarioIdAndMes($id_usuario, $mes_referencia){
        $sql = "SELECT ff.* FROM folha_frequencia ff
                JOIN colaboradores c ON ff.id_colaborador = c.id_colaborador
                WHERE c.id_usuario = ? AND ff.mes_referencia = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_usuario, $mes_referencia]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function findAllByColaborador($id_colaborador){
        $sql = "SELECT * FROM folha_frequencia 
                WHERE id_colaborador = ? ORDER BY mes_referencia DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_colaborador]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}