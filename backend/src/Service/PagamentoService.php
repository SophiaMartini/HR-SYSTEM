<?php

namespace App\Service;

// --- CORREÇÕES (DEPENDÊNCIAS EM FALTA) ---
use App\Core\Database; // (O seu ficheiro de BD)
use App\Domain\Repository\ContrachequeRepository;
use App\Domain\Repository\ColaboradorRepository;
use App\Domain\Repository\PagamentoRepository; // <-- O 'use' QUE FALTAVA
use App\Domain\Repository\RubricaRepository;
use Dompdf\Dompdf;
use Dompdf\Options;
use Exception;
use PDOException;

class PagamentoService
{
    private $db; 
    private $contrachequeRepo;
    private $colaboradorRepo;
    private $rubricaRepo;
    private $pagamentoRepo; 

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection(); // <-- Para a transação
        $this->contrachequeRepo = new ContrachequeRepository();
        $this->colaboradorRepo = new ColaboradorRepository();
        $this->rubricaRepo = new RubricaRepository();
        $this->pagamentoRepo = new PagamentoRepository(); // <-- A inicialização que faltava
    }

    public function gerarFolhaPagamento($competencia)
    {
        $colaboradores = $this->colaboradorRepo->findAll();
        $rubricasFixas = $this->rubricaRepo->findAll(); 
        
        $resultado = [
            'sucesso' => [],
            'erros' => []
        ];

        foreach ($colaboradores as $colaborador) {
            
            try {
                $jaExiste = $this->contrachequeRepo->findByCompetencia(
                    $colaborador['id_colaborador'], 
                    $competencia
                );

                if ($jaExiste) {
                    throw new Exception('Contracheque já existe para esta competência');
                }

                $this->db->beginTransaction();

                $salarioBase = (float) $colaborador['salario'];
                $totalProventos = $salarioBase;
                $totalDescontos = 0;
                
                foreach ($rubricasFixas as $rubrica) {
                    if ($rubrica['tipo'] === 'Desconto' && $rubrica['codigo'] != '101') { 
                        $valorDesconto = $salarioBase * 0.11; 
                        $totalDescontos += $valorDesconto;
                    }
                }

                $dadosContracheque = [
                    'id_colaborador' => $colaborador['id_colaborador'],
                    'competencia' => $competencia,
                    'valor_bruto' => $totalProventos,
                    'total_descontos' => $totalDescontos,
                    'valor_liquido' => $totalProventos - $totalDescontos,
                    'data_emissao' => date('Y-m-d')
                ];
                $idContracheque = $this->contrachequeRepo->create($dadosContracheque);

                $dataPrevista = date('Y-m-d', strtotime($competencia . ' +1 month +5 days')); 
                $this->pagamentoRepo->create($idContracheque, $dataPrevista);

                // Salário Base
                $this->contrachequeRepo->addLancamento(
                    $idContracheque, 
                    $this->getRubricaSalarioBase(), // ID 1
                    $salarioBase
                );
                
                // Descontos
                foreach ($rubricasFixas as $rubrica) {
                    if ($rubrica['tipo'] === 'Desconto' && $rubrica['codigo'] != '101') {
                        $valorDesconto = $salarioBase * 0.11; 
                        $this->contrachequeRepo->addLancamento(
                            $idContracheque, 
                            $rubrica['id_rubrica'], 
                            $valorDesconto
                        );
                    }
                }
                $this->db->commit();

                $resultado['sucesso'][] = [
                    'colaborador' => $colaborador['nome'],
                    'id_contracheque' => $idContracheque
                ];

            } catch (Exception $e) { 
                if ($this->db->inTransaction()) {
                    $this->db->rollBack();
                }

                $resultado['erros'][] = [
                    'colaborador' => $colaborador['nome'] ?? 'Desconhecido',
                    'erro' => $e->getMessage()
                ];
            }
        }

        return $resultado;
    }

    private function getRubricaSalarioBase()
    {
        return 1;
    }

    public function gerarPDF($contracheque, $lancamentos)
    {
        $html = $this->montarHTML($contracheque, $lancamentos);
        
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        return $dompdf->output();
    }

    private function montarHTML($contracheque, $lancamentos)
    {
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Contracheque</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                th { background-color: #f0f0f0; }
                .totais { margin-top: 20px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>CONTRACHEQUE</h1>
                <p>Competência: ' . htmlspecialchars($contracheque['competencia']) . '</p>
            </div>
            
            <div class="info">
                <p><strong>Nome:</strong> ' . htmlspecialchars($contracheque['colaborador_nome']) . '</p>
                <p><strong>CPF:</strong> ' . htmlspecialchars($contracheque['colaborador_cpf']) . '</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Valor (R$)</th>
                    </tr>
                </thead>
                <tbody>';

        foreach ($lancamentos as $lanc) {
            $html .= '
                    <tr>
                        <td>' . htmlspecialchars($lanc['rubrica_codigo']) . '</td>
                        <td>' . htmlspecialchars($lanc['rubrica_descricao']) . '</td>
                        <td>' . htmlspecialchars($lanc['rubrica_tipo']) . '</td>
                        <td>R$ ' . number_format($lanc['valor'], 2, ',', '.') . '</td>
                    </tr>';
        }

        $html .= '
                </tbody>
            </table>

            <div class="totais">
                <p>Total Bruto: R$ ' . number_format($contracheque['valor_bruto'], 2, ',', '.') . '</p>
                <p>Total Descontos: R$ ' . number_format($contracheque['total_descontos'], 2, ',', '.') . '</p>
                <p>Líquido a Receber: R$ ' . number_format($contracheque['valor_liquido'], 2, ',', '.') . '</p>
            </div>
        </body>
        </html>';

        return $html;
    }
}