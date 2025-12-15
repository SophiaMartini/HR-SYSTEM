<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class PontoRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

   
    public function findOrCreateToday($colaboradorId)
    {
        $dataAtual = date('Y-m-d');
        
        
        $stmt = $this->db->prepare(
            "SELECT * FROM controle_ponto WHERE id_colaborador = ? AND data = ?"
        );
        $stmt->execute([$colaboradorId, $dataAtual]);
        $registro = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($registro) {
            return $registro;
        }

        
        $stmt = $this->db->prepare(
            "INSERT INTO controle_ponto (id_colaborador, data, entrada, saida_almoco, retorno_almoco, saida, horas_trabalhadas, observacoes) 
             VALUES (?, ?, NULL, NULL, NULL, NULL, NULL, NULL)"
        );
        $stmt->execute([$colaboradorId, $dataAtual]);
        
        $id = $this->db->lastInsertId();
        
        
        $stmt = $this->db->prepare("SELECT * FROM controle_ponto WHERE id_controle_ponto = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

   
    public function updateEntrada($id, $horario)
    {
        $stmt = $this->db->prepare("UPDATE controle_ponto SET entrada = ? WHERE id_controle_ponto = ?");
        return $stmt->execute([$horario, $id]);
    }

    
    public function updateSaidaAlmoco($id, $horario)
    {
        $stmt = $this->db->prepare("UPDATE controle_ponto SET saida_almoco = ? WHERE id_controle_ponto = ?");
        return $stmt->execute([$horario, $id]);
    }

   
    public function updateRetornoAlmoco($id, $horario)
    {
        $stmt = $this->db->prepare("UPDATE controle_ponto SET retorno_almoco = ? WHERE id_controle_ponto = ?");
        return $stmt->execute([$horario, $id]);
    }

   
    public function updateSaida($id, $horario)
    {
        
        $stmt = $this->db->prepare("SELECT * FROM controle_ponto WHERE id_controle_ponto = ?");
        $stmt->execute([$id]);
        $registro = $stmt->fetch(PDO::FETCH_ASSOC);

        $horasTrabalhadas = null;
        
        
        if ($registro && $registro['entrada'] && $registro['saida_almoco'] && $registro['retorno_almoco']) {
            $entrada = strtotime($registro['entrada']);
            $saidaAlmoco = strtotime($registro['saida_almoco']);
            $retornoAlmoco = strtotime($registro['retorno_almoco']);
            $saida = strtotime($horario);

           
            $tempoDaManha = $saidaAlmoco - $entrada;
            $tempoDaTarde = $saida - $retornoAlmoco;
            $totalSegundos = $tempoDaManha + $tempoDaTarde;

            
            $horas = floor($totalSegundos / 3600);
            $minutos = floor(($totalSegundos % 3600) / 60);
            $segundos = $totalSegundos % 60;
            $horasTrabalhadas = sprintf('%02d:%02d:%02d', $horas, $minutos, $segundos);
        }

        
        $stmt = $this->db->prepare(
            "UPDATE controle_ponto SET saida = ?, horas_trabalhadas = ? WHERE id_controle_ponto = ?"
        );
        return $stmt->execute([$horario, $horasTrabalhadas, $id]);
    }

   
    public function getByColaboradorAndMonth($colaboradorId, $mes)
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM controle_ponto 
             WHERE id_colaborador = ? 
             AND DATE_FORMAT(data, '%Y-%m') = ? 
             ORDER BY data DESC"
        );
        $stmt->execute([$colaboradorId, $mes]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    
    public function getAllByColaborador($colaboradorId)
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM controle_ponto 
             WHERE id_colaborador = ? 
             ORDER BY data DESC"
        );
        $stmt->execute([$colaboradorId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    
    public function colaboradorExists($colaboradorId)
    {
        $stmt = $this->db->prepare("SELECT 1 FROM colaboradores WHERE id_colaborador = ?");
        $stmt->execute([$colaboradorId]);
        return $stmt->fetchColumn() !== false;
    }

    
    public function campoJaPreenchido($registro, $campo)
    {
        return !empty($registro[$campo]);
    }
}