<?php

namespace App\Domain\Repository;

use App\Core\Database;
use PDO;

class InscricaoTreinamentoRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($id_colaborador, $id_treinamento)
    {
        $sql = "INSERT INTO inscricoes_treinamento (id_colaborador, id_treinamento, status) 
                VALUES (:id_colaborador, :id_treinamento, 'Inscrito')";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([
            ':id_colaborador' => $id_colaborador,
            ':id_treinamento' => $id_treinamento
        ]);

        return $this->db->lastInsertId();
    }

    public function findById($id_inscricao)
    {
        $sql = "SELECT * FROM inscricoes_treinamento WHERE id_inscricao = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_inscricao]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function delete($id_inscricao)
    {
        $stmt = $this->db->prepare("DELETE FROM inscricoes_treinamento WHERE id_inscricao = ?");
        $stmt->execute([$id_inscricao]);
        return $stmt->rowCount();
    }

    public function findAllByColaborador($id_colaborador)
    {
        $sql = "SELECT i.*, t.titulo as titulo_treinamento, t.carga_horaria
                FROM inscricoes_treinamento i
                JOIN treinamentos t ON i.id_treinamento = t.id_treinamento
                WHERE i.id_colaborador = ?
                ORDER BY i.data_inscricao DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_colaborador]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function findAllByTreinamento($id_treinamento)
    {
        $sql = "SELECT i.*, u.nome as nome_colaborador, u.email as email_colaborador
                FROM inscricoes_treinamento i
                JOIN colaboradores c ON i.id_colaborador = c.id_colaborador
                JOIN usuarios u ON c.id_usuario = u.id
                WHERE i.id_treinamento = ?
                ORDER BY u.nome ASC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_treinamento]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}