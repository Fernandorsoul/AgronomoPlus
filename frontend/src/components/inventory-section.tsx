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
import { Plus, Package, AlertTriangle, Calendar, Wrench, Loader2, Barcode } from 'lucide-react';
import { inventoryApi, type InventoryItem } from '../api';

export function InventorySection() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await inventoryApi.getAll();
        setInventory(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar inventário:', err);
        setError('Erro ao carregar dados do inventário');
        // Fallback to hardcoded data
        setInventory(hardcodedInventory);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Keep hardcoded data for now, but show loading/error states
  const hardcodedInventory: InventoryItem[] = [
    {
      id: 1,
      name: 'Fertilizante NPK 20-10-20',
      category: 'insumos',
      quantity: 45,
      unit: 'sacos (50kg)',
      purchaseDate: '2024-01-10',
      expiryDate: '2024-08-15',
      supplier: 'AgroSuprimentos Ltda',
      cost: 2250,
      location: 'Galpão A - Prateleira 3',
      status: 'disponivel',
      minQuantity: 20,
    },
    {
      id: 2,
      name: 'Sementes de Milho Híbrido',
      category: 'insumos',
      quantity: 8,
      unit: 'sacos (20kg)',
      purchaseDate: '2024-01-08',
      expiryDate: '2024-06-30',
      supplier: 'SemenTech',
      cost: 1600,
      location: 'Galpão B - Câmara Fria',
      status: 'baixo_estoque',
      minQuantity: 15,
    },
    {
      id: 3,
      name: 'Trator Massey Ferguson 265',
      category: 'equipamentos',
      quantity: 1,
      unit: 'unidade',
      purchaseDate: '2020-03-15',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-04-05',
      supplier: 'Concessionária Rural',
      cost: 120000,
      location: 'Garagem Principal',
      status: 'disponivel',
      minQuantity: 1,
    },
    {
      id: 4,
      name: 'Vermífugo para Bovinos',
      category: 'medicamentos',
      quantity: 3,
      unit: 'frascos (500ml)',
      purchaseDate: '2023-11-10',
      expiryDate: '2024-05-10',
      supplier: 'VetFarm',
      cost: 450,
      location: 'Farmácia',
      status: 'disponivel',
      minQuantity: 5,
    },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'insumos',
    quantity: '',
    unit: '',
    expiryDate: '',
    supplier: '',
    cost: '',
    location: '',
    minQuantity: '',
    barcode: '',
  });

  const categories = [
    { value: 'insumos', label: 'Insumos' },
    { value: 'equipamentos', label: 'Equipamentos' },
    { value: 'medicamentos', label: 'Medicamentos' },
    { value: 'combustivel', label: 'Combustível' },
    { value: 'outros', label: 'Outros' },
  ];

  const getStatusBadge = (item: InventoryItem) => {
    if (item.status === 'vencido') {
      return <Badge variant="destructive">Vencido</Badge>;
    }
    if (item.status === 'baixo_estoque') {
      return <Badge variant="secondary">Baixo Estoque</Badge>;
    }
    if (item.status === 'manutencao') {
      return <Badge variant="outline">Manutenção</Badge>;
    }
    if (item.expiryDate) {
      const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (daysToExpiry <= 30) {
        return <Badge variant="destructive">Vence em {daysToExpiry} dias</Badge>;
      }
    }
    if (item.nextMaintenance) {
      const daysToMaintenance = Math.ceil((new Date(item.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (daysToMaintenance <= 7) {
        return <Badge variant="outline">Manutenção em {daysToMaintenance} dias</Badge>;
      }
    }
    return <Badge variant="default">Disponível</Badge>;
  };

  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity && newItem.supplier) {
      try {
        const itemData = {
          name: newItem.name,
          category: newItem.category,
          quantity: parseInt(newItem.quantity),
          unit: newItem.unit || 'unidades',
          purchaseDate: new Date().toISOString().split('T')[0],
          expiryDate: newItem.expiryDate || undefined,
          supplier: newItem.supplier,
          cost: parseFloat(newItem.cost) || 0,
          location: newItem.location,
          status: parseInt(newItem.quantity) < parseInt(newItem.minQuantity) ? 'baixo_estoque' : 'disponivel',
          minQuantity: parseInt(newItem.minQuantity) || 1,
          barcode: newItem.barcode || undefined,
        };

        const response = await inventoryApi.create(itemData);
        setInventory([response.data, ...inventory]);
        setNewItem({
          name: '',
          category: 'insumos',
          quantity: '',
          unit: '',
          expiryDate: '',
          supplier: '',
          cost: '',
          location: '',
          minQuantity: '',
          barcode: '',
        });
        setIsDialogOpen(false);
      } catch (err) {
        console.error('Erro ao adicionar item:', err);
        setError('Erro ao adicionar item ao inventário');
      }
    }
  };

  const alertItems = inventory.filter(item => {
    if (item.status === 'vencido' || item.status === 'baixo_estoque' || item.status === 'manutencao') {
      return true;
    }
    if (item.expiryDate) {
      const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (daysToExpiry <= 30) return true;
    }
    if (item.nextMaintenance) {
      const daysToMaintenance = Math.ceil((new Date(item.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (daysToMaintenance <= 7) return true;
    }
    return false;
  });

  const totalValue = inventory.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando inventário...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">Mostrando dados de exemplo abaixo:</p>
          </div>
        </div>
        {/* Show hardcoded data as fallback */}
        <div className="space-y-6 opacity-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Inventário (Dados de Exemplo)</h2>
              <p className="text-muted-foreground">Gerencie seus itens de estoque</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Controle de Estoque</h2>
          <p className="text-muted-foreground">Gestão de insumos, equipamentos e manutenções</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
              <DialogDescription>
                Registre um novo item no controle de estoque
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Item</Label>
                <Input
                  placeholder="Nome do produto/equipamento"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={newItem.category} onValueChange={(value: InventoryItem['category']) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <Input
                    placeholder="kg, litros, unidades..."
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="minQuantity">Estoque Mínimo</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.minQuantity}
                    onChange={(e) => setNewItem({...newItem, minQuantity: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="supplier">Fornecedor</Label>
                <Input
                  placeholder="Nome do fornecedor"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost">Custo Unitário (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newItem.cost}
                    onChange={(e) => setNewItem({...newItem, cost: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="expiryDate">Data de Validade</Label>
                  <Input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  placeholder="Galpão, prateleira, setor..."
                  value={newItem.location}
                  onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="barcode">Código de Barras</Label>
                <Input
                  placeholder="Digite ou escaneie o código de barras"
                  value={newItem.barcode}
                  onChange={(e) => setNewItem({...newItem, barcode: e.target.value})}
                />
              </div>

              <Button onClick={handleAddItem} className="w-full">
                Adicionar ao Estoque
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertItems.length}</div>
            <p className="text-xs text-muted-foreground">Itens precisam atenção</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalValue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Valor do estoque</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenções</CardTitle>
            <Wrench className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter(item => item.nextMaintenance && 
                Math.ceil((new Date(item.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) <= 30
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Próximos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alertItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Alertas Importantes
            </CardTitle>
            <CardDescription>
              Itens que precisam da sua atenção imediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.location}</p>
                  </div>
                  {getStatusBadge(item)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Estoque Geral</CardTitle>
          <CardDescription>
            Lista completa de itens no estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Código de Barras</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div>{item.name}</div>
                      {item.expiryDate && (
                        <div className="text-xs text-muted-foreground">
                          Validade: {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      {item.nextMaintenance && (
                        <div className="text-xs text-muted-foreground">
                          Próxima manutenção: {new Date(item.nextMaintenance).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                    {item.quantity <= item.minQuantity && (
                      <div className="text-xs text-red-600">
                        Min: {item.minQuantity}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>R$ {item.cost.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{item.barcode || '-'}</TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}