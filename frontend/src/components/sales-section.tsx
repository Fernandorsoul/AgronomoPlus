import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Plus, ShoppingCart, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface Sale {
  id: string;
  date: string;
  customer: string;
  customerType: 'pessoa_fisica' | 'pessoa_juridica';
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'dinheiro' | 'pix' | 'cartao' | 'transferencia' | 'prazo';
  status: 'pendente' | 'pago' | 'cancelado';
  notes?: string;
}

interface SaleItem {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

interface Customer {
  id: string;
  name: string;
  type: 'pessoa_fisica' | 'pessoa_juridica';
  document: string;
  phone: string;
  email?: string;
  address: string;
}

export function SalesSection() {
  const [sales, setSales] = useState<Sale[]>([
    
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
   
  ]);

  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  
  const [newSale, setNewSale] = useState({
    customer: '',
    paymentMethod: 'dinheiro' as Sale['paymentMethod'],
    notes: '',
  });

  const [saleItems, setSaleItems] = useState<Omit<SaleItem, 'id' | 'totalPrice'>[]>([
    { product: '', quantity: 0, unit: '', unitPrice: 0 },
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    type: 'pessoa_fisica' as Customer['type'],
    document: '',
    phone: '',
    email: '',
    address: '',
  });

  const products = [
    'Milho',
    'Soja',
    'Feijão',
    'Arroz',
    'Tomate',
    'Alface',
    'Cenoura',
    'Batata',
    'Ovos Caipira',
    'Leite',
    'Queijo',
    'Carne Bovina',
    'Frango Caipira',
  ];

  const units = ['kg', 'sacos', 'caixas', 'maços', 'dúzias', 'litros', 'unidades'];

  const monthlyData = [
    
  ];

  const categoryData = [
    
  ];

  const addSaleItem = () => {
    setSaleItems([...saleItems, { product: '', quantity: 0, unit: '', unitPrice: 0 }]);
  };

  const removeSaleItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const updateSaleItem = (index: number, field: keyof Omit<SaleItem, 'id' | 'totalPrice'>, value: any) => {
    const updatedItems = [...saleItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setSaleItems(updatedItems);
  };

  const calculateTotal = () => {
    return saleItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleAddSale = () => {
    if (newSale.customer && saleItems.some(item => item.product && item.quantity > 0)) {
      const sale: Sale = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        customer: customers.find(c => c.id === newSale.customer)?.name || newSale.customer,
        customerType: customers.find(c => c.id === newSale.customer)?.type || 'pessoa_fisica',
        items: saleItems.filter(item => item.product && item.quantity > 0).map((item, index) => ({
          id: `${Date.now()}-${index}`,
          ...item,
          totalPrice: item.quantity * item.unitPrice,
        })),
        totalAmount: calculateTotal(),
        paymentMethod: newSale.paymentMethod,
        status: newSale.paymentMethod === 'prazo' ? 'pendente' : 'pago',
        notes: newSale.notes,
      };
      
      setSales([sale, ...sales]);
      setNewSale({
        customer: '',
        paymentMethod: 'dinheiro',
        notes: '',
      });
      setSaleItems([{ product: '', quantity: 0, unit: '', unitPrice: 0 }]);
      setIsSaleDialogOpen(false);
    }
  };

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.document) {
      const customer: Customer = {
        id: Date.now().toString(),
        ...newCustomer,
      };
      
      setCustomers([customer, ...customers]);
      setNewCustomer({
        name: '',
        type: 'pessoa_fisica',
        document: '',
        phone: '',
        email: '',
        address: '',
      });
      setIsCustomerDialogOpen(false);
    }
  };

  const getStatusBadge = (status: Sale['status']) => {
    switch (status) {
      case 'pago':
        return <Badge variant="default">Pago</Badge>;
      case 'pendente':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const totalRevenue = sales.filter(s => s.status === 'pago').reduce((sum, sale) => sum + sale.totalAmount, 0);
  const pendingRevenue = sales.filter(s => s.status === 'pendente').reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestão de Vendas</h2>
          <p className="text-muted-foreground">Controle completo das vendas e clientes</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Cliente</DialogTitle>
                <DialogDescription>
                  Adicione um novo cliente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Nome/Razão Social</Label>
                  <Input
                    placeholder="Nome ou razão social"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerType">Tipo</Label>
                    <Select value={newCustomer.type} onValueChange={(value: Customer['type']) => setNewCustomer({...newCustomer, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                        <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="document">CPF/CNPJ</Label>
                    <Input
                      placeholder={newCustomer.type === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}
                      value={newCustomer.document}
                      onChange={(e) => setNewCustomer({...newCustomer, document: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea
                    placeholder="Endereço completo"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  />
                </div>
                
                <Button onClick={handleAddCustomer} className="w-full">
                  Cadastrar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nova Venda</DialogTitle>
                <DialogDescription>
                  Adicione uma nova venda
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer">Cliente</Label>
                    <Select value={newSale.customer} onValueChange={(value) => setNewSale({...newSale, customer: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                    <Select value={newSale.paymentMethod} onValueChange={(value: Sale['paymentMethod']) => setNewSale({...newSale, paymentMethod: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="transferencia">Transferência</SelectItem>
                        <SelectItem value="prazo">A Prazo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Itens da Venda</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSaleItem}>
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Item
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {saleItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-4">
                          <Select 
                            value={item.product} 
                            onValueChange={(value) => updateSaleItem(index, 'product', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Produto" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product} value={product}>
                                  {product}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Qtd"
                            value={item.quantity || ''}
                            onChange={(e) => updateSaleItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Select 
                            value={item.unit} 
                            onValueChange={(value) => updateSaleItem(index, 'unit', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Unidade" />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Preço Unit."
                            value={item.unitPrice || ''}
                            onChange={(e) => updateSaleItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div className="col-span-1">
                          <span className="text-sm">
                            R$ {(item.quantity * item.unitPrice).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="col-span-1">
                          {saleItems.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSaleItem(index)}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-right mt-2">
                    <strong>Total: R$ {calculateTotal().toFixed(2)}</strong>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    placeholder="Observações sobre a venda..."
                    value={newSale.notes}
                    onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                  />
                </div>
                
                <Button onClick={handleAddSale} className="w-full">
                  Registrar Venda
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-xs text-muted-foreground">Total de vendas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Confirmada</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Vendas pagas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              R$ {pendingRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Vendas pendentes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Clientes cadastrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução das Vendas</CardTitle>
            <CardDescription>Receita e quantidade por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'vendas' ? `R$ ${Number(value).toLocaleString('pt-BR')}` : value,
                    name === 'vendas' ? 'Receita' : 'Quantidade'
                  ]}
                />
                <Line type="monotone" dataKey="vendas" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="quantidade" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
            <CardDescription>Distribuição dos produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>
            Últimas vendas realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {new Date(sale.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{sale.customer}</div>
                      <div className="text-xs text-muted-foreground">
                        {sale.customerType === 'pessoa_fisica' ? 'PF' : 'PJ'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {sale.items.slice(0, 2).map((item, index) => (
                        <div key={index}>
                          {item.quantity} {item.unit} de {item.product}
                        </div>
                      ))}
                      {sale.items.length > 2 && (
                        <div className="text-muted-foreground">
                          +{sale.items.length - 2} itens
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {sale.paymentMethod.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    R$ {sale.totalAmount.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(sale.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}