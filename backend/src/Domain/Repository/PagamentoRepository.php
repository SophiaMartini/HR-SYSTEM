<?php

namespace App\Domain\Repository;

use App\Core\Database; 
use PDO;

class PagamentoRepository
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    
    public function create($id_contracheque, $data_prevista)
    {
        $sql = "INSERT INTO pagamentos (id_contracheque, data_prevista, status) 
                VALUES (:id_contracheque, :data_prevista, 'Pendente')";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id_contracheque' => $id_contracheque,
            ':data_prevista' => $data_prevista
        ]);
        return $this->db->lastInsertId();
    }

   
    public function findById($id_pagamento)
    {
        $stmt = $this->db->prepare("SELECT * FROM pagamentos WHERE id_pagamento = ?");
        $stmt->execute([$id_pagamento]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    
    public function findByContrachequeId($id_contracheque)
    {
        $stmt = $this->db->prepare("SELECT * FROM pagamentos WHERE id_contracheque = ?");
        $stmt->execute([$id_contracheque]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    
    public function updateStatus($id_pagamento, $status, $data_efetivada)
    {
        $sql = "UPDATE pagamentos 
                SET status = :status, data_efetivada = :data_efetivada 
                WHERE id_pagamento = :id_pagamento";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':status' => $status,
            ':data_efetivada' => $data_efetivada,
            ':id_pagamento' => $id_pagamento
        ]);
        return $stmt->rowCount();
    }
}