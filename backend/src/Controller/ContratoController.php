<?php
namespace App\Controller;

use App\Domain\Repository\ContratoRepository;
use App\Service\FileUploadService;


class ContratoController {
    private $contratoRepository;
    private $fileUploadService;

    public function __construct() {
        $this->contratoRepository = new ContratoRepository();
        $this->fileUploadService = new FileUploadService;
    }

    public function create($idColaborador) {
        
        if (!isset($_REQUEST['user_payload']->role) || $_REQUEST['user_payload']->role !== 'recrutador') {
            http_response_code(403);
            echo json_encode(['error' => 'Acesso negado. Apenas recrutadores podem enviar contratos.']);
            return;
        }
        $tipoContrato = $_POST['tipo_contrato'] ?? null;
        $dataInicio = $_POST['data_inicio'] ?? null;

        if (!$tipoContrato || !$dataInicio) {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de contrato e Data de início são obrigatórios.']);
            return;
        }

        if (!isset($_FILES['path_documento']) || $_FILES['path_documento']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'Arquivo PDF é obrigatório.']);
            return;
        }

        try {

            $destinationFolder = __DIR__ . '../../../Storage/Uploads/Contratos/';
            if (!is_dir($destinationFolder)) {
                mkdir($destinationFolder, 0777, true);
            }

            $nomeArquivo = uniqid() . '_' . basename($_FILES['path_documento']['name']);
            $caminhoDestino = $destinationFolder . $nomeArquivo;
            move_uploaded_file($_FILES['path_documento']['tmp_name'], $caminhoDestino);
            $path = $caminhoDestino;

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao salvar arquivo: ' . $e->getMessage()]);
            return;
        }


        $sucesso = $this->contratoRepository->create([
            'id_colaborador' => $idColaborador,
            'tipo_contrato' => $tipoContrato,
            'data_inicio' => $dataInicio,
            'path_documento' => $path
        ]);

        if ($sucesso) {
            http_response_code(201);
            echo json_encode(['message' => 'Contrato enviado com sucesso!', 'path' => $path]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao salvar no banco de dados.']);
        }
    }

    public function get($idColaborador) {
        $contratos = $this->contratoRepository->findByColaboradorId($idColaborador);
        echo json_encode($contratos);
    }
}