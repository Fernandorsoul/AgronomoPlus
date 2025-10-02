import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { financeiroApi } from '../api';
import type { MovimentacaoFinanceira } from '../api';

interface Transaction {
  id: string;
  date: string;
  type: 'entrada' | 'saida';
  category: string;
  description: string;
  amount: number;
}

export function FinanceSection() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoFinanceira[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'entrada' as 'entrada' | 'saida',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [monthlyData, setMonthlyData] = useState([
    { month: 'Set', entrada: 0, saida: 0 },
    { month: 'Out', entrada: 0, saida: 0 },
    { month: 'Nov', entrada: 0, saida: 0 },
    { month: 'Dez', entrada: 0, saida: 0 },
    { month: 'Jan', entrada: 0, saida: 0 },
  ]);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        const response = await financeiroApi.getAll();
        const data = response.data;
        setMovimentacoes(data);

        // Convert MovimentacaoFinanceira to Transaction format for display
        const convertedTransactions: Transaction[] = data.map(mov => ({
          id: mov.id,
          date: new Date(mov.dataTransacao).toISOString().split('T')[0],
          type: mov.tipoTransacao === 'entrada' ? 'entrada' : 'saida',
          category: 'Geral', // Could be enhanced with categories later
          description: mov.descricao,
          amount: mov.valor,
        }));

        setTransactions(convertedTransactions);

        // Calculate monthly data
        const monthlyStats = calculateMonthlyData(data);
        setMonthlyData(monthlyStats);

      } catch (err) {
        console.error('Erro ao carregar dados financeiros:', err);
        setError('Erro ao carregar dados financeiros');
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  const calculateMonthlyData = (movimentacoes: MovimentacaoFinanceira[]) => {
    const months = ['Set', 'Out', 'Nov', 'Dez', 'Jan'];
    const currentYear = new Date().getFullYear();

    return months.map(month => {
      const monthIndex = months.indexOf(month) + 8; // Set = 8, Out = 9, etc.
      const monthMovs = movimentacoes.filter(mov => {
        const movDate = new Date(mov.dataTransacao);
        return movDate.getMonth() === monthIndex && movDate.getFullYear() === currentYear;
      });

      const entrada = monthMovs
        .filter(mov => mov.tipoTransacao === 'entrada')
        .reduce((sum, mov) => sum + mov.valor, 0);

      const saida = monthMovs
        .filter(mov => mov.tipoTransacao === 'saida')
        .reduce((sum, mov) => sum + mov.valor, 0);

      return { month, entrada, saida };
    });
  };

  const categories = [
    'Venda de Produtos',
    'Venda de Animais',
    'Subsídios',
    'Insumos',
    'Manutenção',
    'Combustível',
    'Mão de Obra',
    'Outros',
  ];

  const totalEntradas = transactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0);
  const totalSaidas = transactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0);
  const saldo = totalEntradas - totalSaidas;

  const handleAddTransaction = () => {
    if (newTransaction.category && newTransaction.description && newTransaction.amount) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        date: newTransaction.date,
        type: newTransaction.type,
        category: newTransaction.category,
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
      };
      
      setTransactions([transaction, ...transactions]);
      setNewTransaction({
        type: 'entrada',
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestão Financeira</h2>
          <p className="text-muted-foreground">Controle completo das suas finanças rurais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Movimentação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Movimentação</DialogTitle>
              <DialogDescription>
                Registre uma nova entrada ou saída financeira
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newTransaction.type} onValueChange={(value: 'entrada' | 'saida') => setNewTransaction({...newTransaction, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  placeholder="Descreva a movimentação..."
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                />
              </div>
              
              <Button onClick={handleAddTransaction} className="w-full">
                Adicionar Movimentação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalEntradas.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalSaidas.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className={`h-4 w-4 ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldo.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
            <CardDescription>Entradas vs Saídas por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Line type="monotone" dataKey="entrada" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="saida" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparação Mensal</CardTitle>
            <CardDescription>Receitas e despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Bar dataKey="entrada" fill="#10b981" />
                <Bar dataKey="saida" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
          <CardDescription>
            Últimas transações registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'entrada' ? 'default' : 'destructive'}>
                      {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right ${transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'entrada' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}