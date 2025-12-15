<?php

namespace App\Service;

use App\Core\Database;
use App\Domain\Repository\AvaliacaoRepository;
use App\Domain\Repository\ItensAvaliacaoRepository; 
use App\Domain\Repository\RecrutadorRepository;
use Exception;
use PDOException;

class AvaliacaoService
{
    private $db;
    private $avaliacaoRepository;
    private $itensAvaliacaoRepository;
    private $recrutadorRepository;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
        $this->avaliacaoRepository = new AvaliacaoRepository();
        $this->itensAvaliacaoRepository = new ItensAvaliacaoRepository(); // <-- CORRIGIDO: 'I' maiúsculo
        $this->recrutadorRepository = new RecrutadorRepository();
    }

    public function criarAvaliacao($data, $id_avaliador)
    {
        // 1. AUTORIZAÇÃO (Verificar se o avaliador é um Recrutador)
        $avaliadorInfo = $this->recrutadorRepository->findByUsuarioId($id_avaliador);
        if (!$avaliadorInfo) {
            throw new Exception("Acesso negado. Apenas recrutadores podem criar avaliações.", 403); // 403 Forbidden
        }
        if (empty($data['id_colaborador']) || empty($data['periodo_avaliacao']) || empty($data['itens']) || !is_array($data['itens'])) {
            throw new Exception("Dados inválidos. 'id_colaborador', 'periodo_avaliacao' e a lista de 'itens' são obrigatórios.", 400);
        }
        try {
            
            $this->db->beginTransaction();

            // Passo A: Criar o "Pai"
            $id_avaliacao_nova = $this->avaliacaoRepository->create($id_avaliador, $data);
            // Passo B: Criar os "Filhos"
            foreach ($data['itens'] as $item) {
                $this->itensAvaliacaoRepository->create($id_avaliacao_nova, $item);
            }

            $this->db->commit();
            
            return $id_avaliacao_nova; 

        } catch (PDOException $e) { // <-- CORRIGIDO: Agora o PHP sabe o que é PDOException
            // Se algo falhou, desfaz tudo
            $this->db->rollBack();
            
            throw new Exception("Falha ao salvar a avaliação no banco de dados: " . $e->getMessage(), 500);
        }
    }
}