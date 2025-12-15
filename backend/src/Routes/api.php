<?php
use App\Middleware\AuthMiddleware;

$router->get('/', function() {
    echo json_encode('API RH SYSTEM');
});

//Rotas de autenticação
$router->post('/registro/candidato', 'AuthController@registrarCandidato');
$router->post('/registro/recrutador', 'AuthController@registrarRecrutador');
$router->post('/login', 'AuthController@login');

$router->mount('/api', function() use ($router) {
    $router->before('GET|POST|PUT|DELETE|PATCH', '/.*', function() {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $middleware = new AuthMiddleware();
            $middleware->handle();
        } catch (\Exception $e) {
            $codigoErro = $e->getCode() ? $e->getCode() : 401;
            http_response_code($codigoErro);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    });

    //---------ROTAS DEPARTAMENTO------//
    $router->get('/departments', 'DepartmentController@getAll');
    $router->get('/departments/(\d+)', 'DepartmentController@getById');
    $router->post('/departments', 'DepartmentController@create');
    $router->put('/departments/(\d+)', 'DepartmentController@update');
    $router->delete('/departments/(\d+)', 'DepartmentController@delete');

    //---------ROTAS COMPETÊNCIA------//
    $router->get('/competencias', 'CompetenciaController@getAll');
    $router->get('/competencias/(\d+)', 'CompetenciaController@getById');
    $router->post('/competencias', 'CompetenciaController@create');
    $router->put('/competencias/(\d+)', 'CompetenciaController@update');
    $router->delete('/competencias/(\d+)', 'CompetenciaController@delete');

    // -------------ROTAS TREINAMENTOTS------------- //
    $router->get('/treinamentos', 'TreinamentoController@getAll');
    $router->get('/treinamentos/(\d+)', 'TreinamentoController@getById');
    $router->post('/treinamentos', 'TreinamentoController@create');
    $router->put('/treinamentos/(\d+)', 'TreinamentoController@update');
    $router->delete('/treinamentos/(\d+)', 'TreinamentoController@delete');

    // -------------ROTAS FOLHA PAGAMENTO------------- //
    $router->get('/rubricas', 'RubricaController@getAll');
    $router->get('/rubricas/(\d+)', 'RubricaController@getById');
    $router->post('/rubricas', 'RubricaController@create');
    $router->put('/rubricas/(\d+)', 'RubricaController@update');
    $router->delete('/rubricas/(\d+)', 'RubricaController@delete');

    // Gerar folha de pagamento
    $router->post('/folha-pagamento/gerar', 'RubricaController@gerarFolhaPagamento');

    // -------------ROTAS CONTRACHEQUES------------- //
    $router->get('/contracheques', 'ContrachequeController@getAll');
    $router->get('/contracheques/(\d+)', 'ContrachequeController@getById');
    $router->get('/colaboradores/(\d+)/contracheques', 'ContrachequeController@getByColaboradorId');
    $router->get('/contracheques/(\d+)/download-pdf', 'ContrachequeController@downloadPDF');

    // -------------ROTAS VAGAS------------- //
    $router->get('/vagas', 'VagasController@getAll');
    $router->get('/vagas/(\d+)', 'VagasController@getById');
    $router->post('/vagas', 'VagasController@create');
    $router->put('/vagas/(\d+)', 'VagasController@update');
    $router->delete('/vagas/(\d+)', 'VagasController@delete');

    // -------------ROTAS CARGOS------------- //
    $router->get('/cargos', 'CargosController@getAll');
    $router->get('/cargos/(\d+)', 'CargosController@getById');
    $router->post('/cargos', 'CargosController@create');
    $router->put('/cargos/(\d+)', 'CargosController@update');
    $router->delete('/cargos/(\d+)', 'CargosController@delete');

    // -------------ROTAS COLABORADORES------------- //
    $router->get('/colaboradores', 'ColaboradorController@getAll');
    $router->get('/colaboradores/(\d+)', 'ColaboradorController@getById');
    $router->post('/colaboradores', 'ColaboradorController@create');
    $router->put('/colaboradores/(\d+)', 'ColaboradorController@update');
    $router->delete('/colaboradores/(\d+)', 'ColaboradorController@delete');

    // -------------ROTAS CANDIDATURAS------------- //
    $router->get('/vagas/(\d+)/candidaturas', 'CandidaturaController@getCandidaturasPorVaga');
    $router->get('/candidaturas/(\d+)', 'CandidaturaController@getById');
    $router->post('/vagas/(\d+)/candidatar', 'CandidaturaController@create');
                //---ROTA PARA MUDAR O STATUS DO CANDIDATO----//
    $router->patch('/candidaturas/(\d+)/status', 'CandidaturaController@mudarStatus');
    // -------------ROTAS EXPERIENCIAS------------- //
    $router->post('/usuarios/(\d+)/experiencias', 'ExperienciaController@create');
    $router->put('/experiencias/(\d+)', 'ExperienciaController@update');
    $router->delete('/experiencias/(\d+)', 'ExperienciaController@delete');
    $router->get('/usuario/(\d+)/experiencias', 'ExperienciaController@getAllByUserId');

    // -------------ROTAS FORMACOES------------- //
    $router->get('/usuario/(\d+)/formacoes', 'FormacaoController@getAllByUserId');
    $router->post('/usuario/(\d+)/formacoes', 'FormacaoController@create');
    $router->put('/formacoes/(\d+)', 'FormacaoController@update');
    $router->delete('/formacoes/(\d+)', 'FormacaoController@delete');

    
    // -------------ROTAS FOlHA FREQUENCIA------------- //
    $router->get('/minha-frequencia', function() {
    (new \App\Controller\FolhaFrequenciaController())->getMinhaFrequenciaDoMes();

});
    // Buscar folha de frequência de um colaborador por mês
    $router->get('/colaboradores/(\d+)/folha-frequencia', 'FolhaFrequenciaController@getByColaboradorId');

// -------------ROTAS ENDERECO------------- //
    $router->get('/usuario/(\d+)/endereco', 'EnderecoController@getAllByUserId');
    $router->post('/usuarios/(\d+)/endereco', 'EnderecoController@create');
    $router->put('/usuarios/(\d+)/endereco', 'EnderecoController@update');

// -------------ROTAS CONTROLE DE PONTO------------- //
$router->post('/ponto/entrada', 'PontoController@entrada');
$router->post('/ponto/saida-almoco', 'PontoController@saidaAlmoco');
$router->post('/ponto/retorno-almoco', 'PontoController@retornoAlmoco');
$router->post('/ponto/saida', 'PontoController@saida');
     // Listar registros de ponto de um colaborador em um mês específico
$router->get('/colaboradores/(\d+)/pontos', 'PontoController@getAllByColaboradorId');


// -------------ROTAS AVALIACOES------------- //
$router->get('/colaborador/(\d+)/avaliacoes', 'AvaliacaoController@getAvaliacoesPorColaborador');
$router->get('/colaborador/avaliacao/(\d+)', 'AvaliacaoController@getAvaliacaoDetalhada');
$router->post('/avaliacoes', 'AvaliacaoController@create');
// -------------ROTAS INSCRICOES TREINAMENTOS------------- //
$router->get('/minhas-inscricoes', 'InscricaoTreinamentoController@getMinhasInscricoes');
$router->post('/treinamento/(\d+)/inscrever', 'InscricaoTreinamentoController@create');
$router->delete('/minhas-inscricoes/(\d+)', 'InscricaoTreinamentoController@delete');
$router->get('/inscricoes/(\d+)', 'InscricaoTreinamentoController@getInscritosPorTreinamento');

// ------------- ROTAS BANCO DE HORAS ------------- //
// Buscar banco de horas de um colaborador específico
$router->get('/colaboradores/(\d+)/banco-horas', 'BancoHorasController@getByColaboradorId');
//PAGAMENTOs
$router->patch('/pagamentos/(\d+)/confirmar', 'PagamentoController@confirmarPagamento');
//CONTRATO DE TRABALHO
$router->post('/colaborador/(\d+)/contrato', 'ContratoController@create');
});

