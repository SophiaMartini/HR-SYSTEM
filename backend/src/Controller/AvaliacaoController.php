<?php

namespace App\Controller;
use App\Domain\Repository\AvaliacaoRepository;
use App\Domain\Repository\ItensAvaliacaoRepository;
use App\Service\AvaliacaoService;
use Exception;
class AvaliacaoController{
    private $avaliacaoRepository;
    private $itensAvaliacaoRepository;
    private $avaliacaoService;
    public function __construct(){
        $this->avaliacaoRepository = new AvaliacaoRepository();
        $this->itensAvaliacaoRepository = new ItensAvaliacaoRepository();
        $this->avaliacaoService = new AvaliacaoService();
        
    }
    
    public function getAvaliacoesPorColaborador($id_colaborador){
        header('Content-Type: application/json; charset=utf-8');
        try{
            $avaliacoes = $this->avaliacaoRepository->findAllByColaboradorId($id_colaborador);
            echo json_encode($avaliacoes);
        }catch(Exception $e){
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    public function getAvaliacaodetalhada($id_avaliacao){
        header('Content-Type: application/json; charset=utf-8');
        try{
            $avaliacao = $this->avaliacaoRepository->findById($id_avaliacao);
            $itens = $this->itensAvaliacaoRepository->findAllByAvaliacaoId($id_avaliacao);
            if(!$avaliacao){
                http_response_code(404);
                echo json_encode(['error' => 'Avalição não encontrada']);
                return;
            }
            $resposta = [
                'avaliacao' => $avaliacao,
                'itens' => $itens
            ];
            echo json_encode($resposta);
            
        }catch(Exception $e){
            http_response_code(500);
            echo json_encode(['error' => 'Avaliação não encontrada.' . $e->getMessage()]);
        }
    }
    public function create()
    {
        header('Content-Type: application/json; charset=utf-8');
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            $id_avaliador = $this->getUsuarioIdLogado();
            $novoId = $this->avaliacaoService->criarAvaliacao($data, $id_avaliador);
            
            http_response_code(201); 
            echo json_encode([
                'id_avaliacao_criada' => $novoId,
                'message' => 'Avaliação criada com sucesso.'
            ]);

        } catch (Exception $e) {
            $codigoErro = $e->getCode() ? $e->getCode() : 500;
            http_response_code($codigoErro);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    private function getUsuarioIdLogado() {
        if (!isset($_REQUEST['user_payload'])) {
            throw new Exception('Utilizador não autenticado.', 401);
        }
        $payload = $_REQUEST['user_payload'];
        if (!isset($payload->sub)) {
            throw new Exception('Payload do token inválido.', 401);
        }
        return $payload->sub;
    }
}
