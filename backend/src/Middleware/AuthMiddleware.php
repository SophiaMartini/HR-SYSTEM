<?php

namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;


class AuthMiddleware
{

    public function handle()
    {
      
        $secretKey = $_ENV['JWT_SECRET'];
        if (!$secretKey) {
            throw new Exception('Chave secreta JWT não configurada no .env', 500);
        }

        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            throw new Exception('Token de acesso não fornecido', 401);
        }

        $authHeader = $headers['Authorization'];
        
        $parts = explode(' ', $authHeader);
        if (count($parts) !== 2 || $parts[0] !== 'Bearer') {
            throw new Exception('Token mal formatado', 401);
        }

        $token = $parts[1];
        if (empty($token)) {
            throw new Exception('Token não fornecido', 401);
        }

        try {
            $payload = JWT::decode($token, new Key($secretKey, 'HS256'));
            $_REQUEST['user_payload'] = $payload;
        } catch (Exception $e) {
            
            throw new Exception('Token inválido ou expirado', 401);
        }
      
        return true;
    }
}