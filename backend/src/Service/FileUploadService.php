<?php

namespace App\Service;

use Exception;


class FileUploadService
{
    private $uploadDir;

    public function __construct(){
        $this->uploadDir = __DIR__ . '/../../Storage/Uploads/Resumes/';
        // Cria  se ele não existir
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    /**
     * Processa um ficheiro de upload (de $_FILES)
     * @param $file array O ficheiro de $_FILES (ex: $_FILES['curriculo'])
     * @return string O caminho do ficheiro guardado
     */
    public function upload($file)
    {
        // 1. Verificar erros de upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Erro durante o upload do ficheiro.', 400);
        }

        // 2. Verificar tamanho (ex: max 5MB)
        $maxSize = 5 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            throw new Exception('Ficheiro excede o tamanho limite de 5MB.', 400);
        }

        // 3Verificar tipo (ex: apenas PDF)
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        if ($mime !== 'application/pdf' ) {
            throw new Exception('Tipo de ficheiro inválido. Apenas PDFs são aceites.', 400);
        }
        // Gerar um nome único para evitar sobreposições
        $safeName = uniqid() . '-' . preg_replace('/[^A-Za-z0-9.\-]/', '', basename($file['name']));
        $targetPath = $this->uploadDir . $safeName;
        // Mover o ficheiro do local temporário para o destino final
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new Exception('Falha ao guardar o ficheiro no servidor.', 500);
        }

        return 'Storage/Uploads/Resumes/' . $safeName;
    }
}