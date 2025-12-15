<?php

require __DIR__ . '/../vendor/autoload.php';

use Bramus\Router\Router;

date_default_timezone_set('America/Sao_Paulo');


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$router = new Router();

$router->setNamespace('\App\Controller');

require __DIR__ . '/../src/Routes/api.php';

$router->run();