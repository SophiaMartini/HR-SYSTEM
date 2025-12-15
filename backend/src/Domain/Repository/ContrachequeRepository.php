<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class ContrachequeRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAll()
    {
        $sql = "SELECT 
                    c.*,
                    u.nome as colaborador_nome,
                    u.cpf as colaborador_cpf
                FROM contracheques c
                JOIN colaboradores col ON c.id_colaborador = col.id_colaborador
                JOIN usuarios u ON col.id_usuario = u.id
                ORDER BY c.competencia DESC, c.id_contracheque DESC";
        
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id)
    {
        $sql = "SELECT 
                    c.*,
                    u.nome as colaborador_nome,
                    u.cpf as colaborador_cpf,
                    u.email as colaborador_email
                FROM contracheques c
                JOIN colaboradores col ON c.id_colaborador = col.id_colaborador
                JOIN usuarios u ON col.id_usuario = u.id
                WHERE c.id_contracheque = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByColaborador($colaboradorId)
    {
        $sql = "SELECT * FROM contracheques 
                WHERE id_colaborador = ? 
                ORDER BY competencia DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$colaboradorId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findByCompetencia($colaboradorId, $competencia)
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM contracheques 
             WHERE id_colaborador = ? AND competencia = ?"
        );
        $stmt->execute([$colaboradorId, $competencia]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $sql = "INSERT INTO contracheques 
                (id_colaborador, competencia, valor_bruto, total_descontos, valor_liquido, data_emissao) 
                VALUES (?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['id_colaborador'],
            $data['competencia'],
            $data['valor_bruto'],
            $data['total_descontos'],
            $data['valor_liquido']
        ]);

        return $this->db->lastInsertId();
    }

    public function getLancamentosByContracheque($idContracheque)
    {
        $sql = "SELECT 
                    lf.*,
                    r.codigo as rubrica_codigo,
                    r.descricao as rubrica_descricao,
                    r.tipo as rubrica_tipo
                FROM lancamentos_folha lf
                JOIN rubricas r ON lf.id_rubrica = r.id_rubrica
                WHERE lf.id_contracheque = ?
                ORDER BY r.tipo DESC, r.codigo";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$idContracheque]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addLancamento($idContracheque, $idRubrica, $valor)
    {
        $sql = "INSERT INTO lancamentos_folha (id_contracheque, id_rubrica, valor) 
                VALUES (?, ?, ?)";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$idContracheque, $idRubrica, $valor]);
    }
}