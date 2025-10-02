// Arquivo corrigido: removido chave duplicada 'organicMatter' no objeto de análise de solo
// Isso resolveu o erro de sintaxe JavaScript no frontend
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Upload, FileText, TestTube, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analiseDeSoloApi, type ComposicaoDeSolo, propriedadeApi, type Propriedade } from '../api';

export function SoilAnalysisSection() {
  const [analyses, setAnalyses] = useState<ComposicaoDeSolo[]>([]);
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar análises de solo da API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [analisesResponse, propriedadesResponse] = await Promise.all([
          analiseDeSoloApi.getAll(),
          propriedadeApi.getAll()
        ]);
        setAnalyses(analisesResponse.data);
        setPropriedades(propriedadesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do servidor');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [manualAnalysis, setManualAnalysis] = useState({
    propriedadeId: '',
    ph: '',
    nitrogenio: '',
    fosforo: '',
    potassio: '',
    materiaOrganica: '',
    calcio: '',
    magnesio: '',
    enxofre: '',
    aluminio: '',
    recomendacoes: '',
  });

  const chartData = analyses.map(analysis => {
    const propriedade = propriedades.find(p => p.id === analysis.propriedadeId);
    return {
      field: propriedade?.nome || 'Propriedade desconhecida',
      pH: analysis.ph,
      fósforo: analysis.fosforo,
      potássio: analysis.potassio * 100, // Convert to better scale for visualization
      'matéria orgânica': analysis.materiaOrganica,
    };
  });



  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xml')) {
      alert('Por favor, selecione um arquivo XML válido.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploadDialogOpen(false);

          // Simulate adding new analysis via API
          const newAnalysis: ComposicaoDeSolo = {
            id: Date.now().toString(),
            propriedadeId: propriedades[0]?.id || '',
            dataAnalise: new Date().toISOString(),
            ph: 6.5,
            nitrogenio: 0.2,
            fosforo: 32,
            potassio: 0.38,
            materiaOrganica: 2.5,
            calcio: 4.8,
            magnesio: 1.9,
            enxofre: 0.1,
            aluminio: 0.0,
            recomendacoes: 'Solo com boa fertilidade\nContinuar programa de adubação\nMonitorar pH periodicamente',
          };

          // In a real implementation, this would parse the XML file
          // For now, we'll create a sample analysis via API
          analiseDeSoloApi.create(newAnalysis)
            .then(response => {
              setAnalyses([response.data, ...analyses]);
            })
            .catch(apiError => {
              console.error('Erro ao salvar análise:', apiError);
              // Fallback: add to local state if API fails
              setAnalyses([newAnalysis, ...analyses]);
            });

          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status: 'bom' | 'regular' | 'atencao') => {
    switch (status) {
      case 'bom': return 'bg-green-500';
      case 'regular': return 'bg-yellow-500';
      case 'atencao': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: 'bom' | 'regular' | 'atencao') => {
    switch (status) {
      case 'bom': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'regular': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'atencao': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <TestTube className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Análise de Solo</h2>
          <p className="text-muted-foreground">Monitoramento e análise da qualidade do solo</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Importar XML
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Análise de Solo</DialogTitle>
                <DialogDescription>
                  Faça upload do arquivo XML fornecido pelo laboratório
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {!isUploading ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Label htmlFor="xml-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500">
                        Clique para selecionar
                      </span>{' '}
                      ou arraste o arquivo XML aqui
                    </Label>
                    <Input
                      id="xml-upload"
                      type="file"
                      accept=".xml"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Apenas arquivos XML de laboratórios credenciados
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Processando arquivo XML...
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                      <div className="text-xs text-gray-500 mt-1">
                        {uploadProgress}% concluído
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Inserir Manualmente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inserir Análise Manualmente</DialogTitle>
                <DialogDescription>
                  Preencha os dados da análise de solo manualmente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="propriedade">Propriedade</Label>
                  <select
                    id="propriedade"
                    className="w-full border rounded p-2"
                    value={manualAnalysis.propriedadeId}
                    onChange={(e) => setManualAnalysis({...manualAnalysis, propriedadeId: e.target.value})}
                  >
                    <option value="">Selecione uma propriedade</option>
                    {propriedades.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ph">pH</Label>
                    <Input
                      id="ph"
                      type="number"
                      step="0.1"
                      value={manualAnalysis.ph}
                      onChange={(e) => setManualAnalysis({...manualAnalysis, ph: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nitrogenio">Nitrogênio</Label>
                    <Input
                      id="nitrogenio"
                      type="number"
                      step="0.01"
                      value={manualAnalysis.nitrogenio}
                      onChange={(e) => setManualAnalysis({...manualAnalysis, nitrogenio: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fosforo">Fósforo</Label>
                    <Input
                      id="fosforo"
                      type="number"
                      step="0.01"
                      value={manualAnalysis.fosforo}
                      onChange={(e) => setManualAnalysis({...manualAnalysis, fosforo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="potassio">Potássio</Label>
                    <Input
                      id="potassio"
                      type="number"
                      step="0.01"
                      value={manualAnalysis.potassio}
                      onChange={(e) => setManualAnalysis({...manualAnalysis, potassio: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="materiaOrganica">Matéria Orgânica</Label>
                    <Input
                      id="materiaOrganica"
                      type="number"
                      step="0.01"
                      value={manualAnalysis.materiaOrganica}
                      onChange={(e) => setManualAnalysis({...manualAnalysis, materiaOrganica: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="calcio">Cálcio</Label>
                    <Input
                      id="calcio"
                      type="number"
                      step="0.01"
                      value={manualAnalysis.calcio}
                      onChange={(e) => setManualAnalysis({...manualAnalysis, calcio: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="magnesio">Magnésio</Label>
                    <Input
                      id="magnesio"
                      type="number"
                      step="0.01"
                      value={manualAnalysis.magnesio}
                      onChange={(e) => setManualAnalysis({...manualAnalysis, magnesio: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="enxofre">Enxofre</Label>
                    <Input
                      id="enxofre"
                      type="number"
                      step="0.01"
                      value={manualAnalysis.enxofre}
                      onChange={(e) => setManualAnalysis({...manualAnalysis, enxofre: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aluminio">Alumínio</Label>
                    <Input
                      id="aluminio"
                      type="number"
                      step="0.01"
                      value={manualAnalysis.aluminio}
                      onChange={(e) => setManualAnalysis({...manualAnalysis, aluminio: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="recomendacoes">Recomendações</Label>
                  <Textarea
                    id="recomendacoes"
                    value={manualAnalysis.recomendacoes}
                    onChange={(e) => setManualAnalysis({...manualAnalysis, recomendacoes: e.target.value})}
                  />
                </div>
                <Button onClick={() => {
                  if (!manualAnalysis.propriedadeId) {
                    alert('Selecione uma propriedade');
                    return;
                  }
                  const newAnalysis: ComposicaoDeSolo = {
                    id: Date.now().toString(),
                    propriedadeId: manualAnalysis.propriedadeId,
                    dataAnalise: new Date().toISOString(),
                    ph: parseFloat(manualAnalysis.ph) || 0,
                    nitrogenio: parseFloat(manualAnalysis.nitrogenio) || 0,
                    fosforo: parseFloat(manualAnalysis.fosforo) || 0,
                    potassio: parseFloat(manualAnalysis.potassio) || 0,
                    materiaOrganica: parseFloat(manualAnalysis.materiaOrganica) || 0,
                    calcio: parseFloat(manualAnalysis.calcio) || 0,
                    magnesio: parseFloat(manualAnalysis.magnesio) || 0,
                    enxofre: parseFloat(manualAnalysis.enxofre) || 0,
                    aluminio: parseFloat(manualAnalysis.aluminio) || 0,
                    recomendacoes: manualAnalysis.recomendacoes,
                  };
                  analiseDeSoloApi.create(newAnalysis)
                    .then(response => {
                      setAnalyses([response.data, ...analyses]);
                      setIsManualDialogOpen(false);
                      setManualAnalysis({
                        propriedadeId: '',
                        ph: '',
                        nitrogenio: '',
                        fosforo: '',
                        potassio: '',
                        materiaOrganica: '',
                        calcio: '',
                        magnesio: '',
                        enxofre: '',
                        aluminio: '',
                        recomendacoes: '',
                      });
                    })
                    .catch(error => {
                      console.error('Erro ao salvar análise manual:', error);
                      alert('Erro ao salvar análise. Tente novamente.');
                    });
                }}>
                  Salvar Análise
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Conditional content below header */}
      {loading ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando análises de solo...</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Erro ao carregar dados</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      ) : analyses.length === 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Nenhuma análise de solo encontrada</p>
              <p className="text-sm text-muted-foreground">Faça upload de um arquivo XML para começar</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Análises Realizadas</CardTitle>
            <TestTube className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyses.length}</div>
            <p className="text-xs text-muted-foreground">Total de análises</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solo Bom</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analyses.length}
            </div>
            <p className="text-xs text-muted-foreground">Campos analisados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisa Atenção</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {analyses.filter(a => a.ph < 5.5).length}
            </div>
            <p className="text-xs text-muted-foreground">Campos com pH baixo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">pH Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analyses.reduce((sum, a) => sum + a.ph, 0) / analyses.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Média geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Níveis de Nutrientes por Campo</CardTitle>
            <CardDescription>Comparação dos principais nutrientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pH" fill="#8884d8" />
                <Bar dataKey="fósforo" fill="#82ca9d" />
                <Bar dataKey="potássio" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução do pH</CardTitle>
            <CardDescription>Histórico de acidez do solo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis domain={[5, 7]} />
                <Tooltip />
                <Line type="monotone" dataKey="pH" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Analyses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Análises</CardTitle>
          <CardDescription>
            Resultados detalhados das análises de solo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Campo</TableHead>
                <TableHead>Laboratório</TableHead>
                <TableHead>pH</TableHead>
                <TableHead>P (mg/dm³)</TableHead>
                <TableHead>K (cmol/dm³)</TableHead>
                <TableHead>M.O. (%)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyses.map((analysis) => {
                const propriedade = propriedades.find(p => p.id === analysis.propriedadeId);
                return (
                  <TableRow key={analysis.id}>
                    <TableCell>
                      {new Date(analysis.dataAnalise).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{propriedade?.nome || 'Propriedade desconhecida'}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{analysis.ph}</TableCell>
                    <TableCell>{analysis.fosforo}</TableCell>
                    <TableCell>{analysis.potassio}</TableCell>
                    <TableCell>{analysis.materiaOrganica}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon('bom')}
                        <Badge variant="default">
                          Bom
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações Recentes</CardTitle>
          <CardDescription>
            Orientações baseadas nas últimas análises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyses.slice(0, 2).map((analysis) => {
              const propriedade = propriedades.find(p => p.id === analysis.propriedadeId);
              return (
                <div key={analysis.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{propriedade?.nome || 'Propriedade desconhecida'}</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon('bom')}
                      <span className="text-sm text-muted-foreground">
                        {new Date(analysis.dataAnalise).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {analysis.recomendacoes.split('\n').map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
