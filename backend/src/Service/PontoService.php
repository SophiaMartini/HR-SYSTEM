<?php

namespace App\Service;

use App\Core\Database;
use PDO;

class PontoService
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function processarPontoDoDia($colaboradorId, $data = null)
    {
        $data = $data ?? date('Y-m-d');
        
        $stmt = $this->db->prepare(
            "SELECT * FROM controle_ponto WHERE id_colaborador = ? AND data = ?"
        );
        $stmt->execute([$colaboradorId, $data]);
        $ponto = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$ponto) {
            return null;
        }

        if (!$ponto['entrada'] || !$ponto['saida_almoco'] || 
            !$ponto['retorno_almoco'] || !$ponto['saida']) {
            return [
                'completo' => false,
                'mensagem' => 'Ponto do dia ainda não foi completado'
            ];
        }

        $horasTrabalhadas = $this->calcularHorasTrabalhadas(
            $ponto['entrada'],
            $ponto['saida_almoco'],
            $ponto['retorno_almoco'],
            $ponto['saida']
        );

        $horasExtras = $this->calcularHorasExtras($horasTrabalhadas);

        $stmt = $this->db->prepare(
            "UPDATE controle_ponto 
             SET horas_trabalhadas = ?, observacoes = ? 
             WHERE id_controle_ponto = ?"
        );
        
        $observacao = $horasExtras > 0 
            ? "Horas extras: " . $this->formatarTempo($horasExtras)
            : null;

        $stmt->execute([
            $this->formatarTempo($horasTrabalhadas),
            $observacao,
            $ponto['id_controle_ponto']
        ]);

        $this->atualizarBancoHoras($colaboradorId, $horasExtras);

        return [
            'completo' => true,
            'horas_trabalhadas' => $this->formatarTempo($horasTrabalhadas),
            'horas_extras' => $this->formatarTempo($horasExtras),
            'saldo_banco_horas' => $this->formatarTempo($this->getSaldoBancoHoras($colaboradorId))
        ];
    }

    private function calcularHorasTrabalhadas($entrada, $saidaAlmoco, $retornoAlmoco, $saida)
    {
        $entradaTime = strtotime($entrada);
        $saidaAlmocoTime = strtotime($saidaAlmoco);
        $retornoAlmocoTime = strtotime($retornoAlmoco);
        $saidaTime = strtotime($saida);

        $tempoManha = $saidaAlmocoTime - $entradaTime;
        $tempoTarde = $saidaTime - $retornoAlmocoTime;
        $totalSegundos = $tempoManha + $tempoTarde;

        return $totalSegundos / 3600;
    }

    private function calcularHorasExtras($horasTrabalhadas)
    {
        $jornadaNormal = 8;
        $horasExtras = $horasTrabalhadas - $jornadaNormal;
        
        return $horasExtras > 0 ? $horasExtras : 0;
    }

    private function formatarTempo($horasDecimais)
    {
        $horas = floor($horasDecimais);
        $minutos = floor(($horasDecimais - $horas) * 60);
        $segundos = floor(((($horasDecimais - $horas) * 60) - $minutos) * 60);
        
        return sprintf('%02d:%02d:%02d', $horas, $minutos, $segundos);
    }

    private function atualizarBancoHoras($colaboradorId, $horasExtras)
    {
        if ($horasExtras <= 0) {
            return;
        }

        $stmt = $this->db->prepare(
            "SELECT * FROM banco_horas WHERE id_colaborador = ?"
        );
        $stmt->execute([$colaboradorId]);
        $banco = $stmt->fetch(PDO::FETCH_ASSOC);

        $novoSaldo = ($banco['saldo_horas'] ?? 0) + $horasExtras;

        if ($banco) {
            $stmt = $this->db->prepare(
                "UPDATE banco_horas 
                 SET saldo_horas = ?, data_atualizacao = NOW() 
                 WHERE id_banco_horas = ?"
            );
            $stmt->execute([$novoSaldo, $banco['id_banco_horas']]);
        } else {
            $stmt = $this->db->prepare(
                "INSERT INTO banco_horas (id_colaborador, saldo_horas, data_atualizacao) 
                 VALUES (?, ?, NOW())"
            );
            $stmt->execute([$colaboradorId, $novoSaldo]);
        }
    }

    private function getSaldoBancoHoras($colaboradorId)
    {
        $stmt = $this->db->prepare(
            "SELECT saldo_horas FROM banco_horas WHERE id_colaborador = ?"
        );
        $stmt->execute([$colaboradorId]);
        $banco = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $banco['saldo_horas'] ?? 0;
    }

    public function processarPontosDoDia($data = null)
    {
        $data = $data ?? date('Y-m-d');
        
        $stmt = $this->db->prepare(
            "SELECT DISTINCT id_colaborador 
             FROM controle_ponto 
             WHERE data = ? 
             AND entrada IS NOT NULL 
             AND saida_almoco IS NOT NULL 
             AND retorno_almoco IS NOT NULL 
             AND saida IS NOT NULL
             AND horas_trabalhadas IS NULL"
        );
        $stmt->execute([$data]);
        $colaboradores = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $resultados = [];
        foreach ($colaboradores as $colab) {
            $resultado = $this->processarPontoDoDia($colab['id_colaborador'], $data);
            $resultados[] = [
                'colaborador_id' => $colab['id_colaborador'],
                'resultado' => $resultado
            ];
        }

        return $resultados;
    }
}