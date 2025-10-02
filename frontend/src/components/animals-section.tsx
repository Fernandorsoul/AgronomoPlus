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
import { Plus, Heart, Syringe, Calendar, AlertTriangle, Activity } from 'lucide-react';

interface Animal {
  id: string;
  name: string;
  type: 'bovino' | 'suino' | 'ovino' | 'caprino' | 'aves' | 'equino';
  breed: string;
  birthDate: string;
  weight: number;
  gender: 'macho' | 'femea';
  tag: string;
  location: string;
  healthStatus: 'saudavel' | 'doente' | 'tratamento' | 'quarentena';
  vaccinations: Vaccination[];
}

interface Vaccination {
  id: string;
  vaccine: string;
  date: string;
  nextDue: string;
  veterinarian: string;
  notes?: string;
  status: 'aplicada' | 'pendente' | 'atrasada';
}

export function AnimalsSection() {
  const [animals, setAnimals] = useState<Animal[]>([
    {
      id: '1',
      name: 'Mimosa',
      type: 'bovino',
      breed: 'Nelore',
      birthDate: '2022-03-15',
      weight: 450,
      gender: 'femea',
      tag: 'BOV001',
      location: 'Pasto 1',
      healthStatus: 'saudavel',
      vaccinations: [
        {
          id: '1',
          vaccine: 'Febre Aftosa',
          date: '2023-11-15',
          nextDue: '2024-05-15',
          veterinarian: 'Dr. João Silva',
          status: 'pendente',
        },
        {
          id: '2',
          vaccine: 'Brucelose',
          date: '2023-08-10',
          nextDue: '2024-08-10',
          veterinarian: 'Dr. João Silva',
          status: 'aplicada',
        },
      ],
    },
    {
      id: '2',
      name: 'Touro Forte',
      type: 'bovino',
      breed: 'Angus',
      birthDate: '2021-01-20',
      weight: 680,
      gender: 'macho',
      tag: 'BOV002',
      location: 'Pasto 2',
      healthStatus: 'saudavel',
      vaccinations: [
        {
          id: '3',
          vaccine: 'Clostridiose',
          date: '2023-12-01',
          nextDue: '2024-03-01',
          veterinarian: 'Dr. Maria Santos',
          status: 'atrasada',
        },
      ],
    },
    {
      id: '3',
      name: 'Porquinha Rosa',
      type: 'suino',
      breed: 'Large White',
      birthDate: '2023-06-10',
      weight: 120,
      gender: 'femea',
      tag: 'SUI001',
      location: 'Pocilga A',
      healthStatus: 'tratamento',
      vaccinations: [
        {
          id: '4',
          vaccine: 'Peste Suína',
          date: '2023-07-15',
          nextDue: '2024-01-15',
          veterinarian: 'Dr. Carlos Oliveira',
          status: 'aplicada',
        },
      ],
    },
  ]);

  const [isAnimalDialogOpen, setIsAnimalDialogOpen] = useState(false);
  const [isVaccineDialogOpen, setIsVaccineDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');
  
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    type: 'bovino' as Animal['type'],
    breed: '',
    birthDate: '',
    weight: '',
    gender: 'femea' as Animal['gender'],
    tag: '',
    location: '',
  });

  const [newVaccination, setNewVaccination] = useState({
    animalId: '',
    vaccine: '',
    date: new Date().toISOString().split('T')[0],
    nextDue: '',
    veterinarian: '',
    notes: '',
  });

  const animalTypes = [
    { value: 'bovino', label: 'Bovino' },
    { value: 'suino', label: 'Suíno' },
    { value: 'ovino', label: 'Ovino' },
    { value: 'caprino', label: 'Caprino' },
    { value: 'aves', label: 'Aves' },
    { value: 'equino', label: 'Equino' },
  ];

  const vaccines = [
    'Febre Aftosa',
    'Brucelose',
    'Clostridiose',
    'Raiva',
    'IBR/BVD',
    'Leptospirose',
    'Carbúnculo',
    'Peste Suína',
    'Newcastle (Aves)',
    'Gumboro (Aves)',
  ];

  const getPendingVaccinations = () => {
    const pending: Array<{animal: Animal, vaccination: Vaccination}> = [];
    animals.forEach(animal => {
      animal.vaccinations.forEach(vaccination => {
        if (vaccination.status === 'pendente' || vaccination.status === 'atrasada') {
          pending.push({ animal, vaccination });
        }
      });
    });
    return pending.sort((a, b) => new Date(a.vaccination.nextDue).getTime() - new Date(b.vaccination.nextDue).getTime());
  };

  const getHealthStatusBadge = (status: Animal['healthStatus']) => {
    switch (status) {
      case 'saudavel':
        return <Badge variant="default">Saudável</Badge>;
      case 'doente':
        return <Badge variant="destructive">Doente</Badge>;
      case 'tratamento':
        return <Badge variant="secondary">Em Tratamento</Badge>;
      case 'quarentena':
        return <Badge variant="outline">Quarentena</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getVaccinationStatusBadge = (vaccination: Vaccination) => {
    const today = new Date();
    const dueDate = new Date(vaccination.nextDue);
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (vaccination.status === 'atrasada' || daysDiff < 0) {
      return <Badge variant="destructive">Atrasada</Badge>;
    }
    if (daysDiff <= 7) {
      return <Badge variant="secondary">Vence em {daysDiff} dias</Badge>;
    }
    if (vaccination.status === 'pendente') {
      return <Badge variant="outline">Pendente</Badge>;
    }
    return <Badge variant="default">Em dia</Badge>;
  };

  const handleAddAnimal = () => {
    if (newAnimal.name && newAnimal.breed && newAnimal.tag) {
      const animal: Animal = {
        id: Date.now().toString(),
        name: newAnimal.name,
        type: newAnimal.type,
        breed: newAnimal.breed,
        birthDate: newAnimal.birthDate,
        weight: parseFloat(newAnimal.weight) || 0,
        gender: newAnimal.gender,
        tag: newAnimal.tag,
        location: newAnimal.location,
        healthStatus: 'saudavel',
        vaccinations: [],
      };
      
      setAnimals([animal, ...animals]);
      setNewAnimal({
        name: '',
        type: 'bovino',
        breed: '',
        birthDate: '',
        weight: '',
        gender: 'femea',
        tag: '',
        location: '',
      });
      setIsAnimalDialogOpen(false);
    }
  };

  const handleAddVaccination = () => {
    if (newVaccination.animalId && newVaccination.vaccine && newVaccination.nextDue) {
      const vaccination: Vaccination = {
        id: Date.now().toString(),
        vaccine: newVaccination.vaccine,
        date: newVaccination.date,
        nextDue: newVaccination.nextDue,
        veterinarian: newVaccination.veterinarian,
        notes: newVaccination.notes,
        status: 'aplicada',
      };
      
      setAnimals(animals.map(animal => 
        animal.id === newVaccination.animalId 
          ? { ...animal, vaccinations: [...animal.vaccinations, vaccination] }
          : animal
      ));
      
      setNewVaccination({
        animalId: '',
        vaccine: '',
        date: new Date().toISOString().split('T')[0],
        nextDue: '',
        veterinarian: '',
        notes: '',
      });
      setIsVaccineDialogOpen(false);
    }
  };

  const pendingVaccinations = getPendingVaccinations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestão de Animais</h2>
          <p className="text-muted-foreground">Controle sanitário e vacinação do rebanho</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isVaccineDialogOpen} onOpenChange={setIsVaccineDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Syringe className="h-4 w-4 mr-2" />
                Registrar Vacinação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Vacinação</DialogTitle>
                <DialogDescription>
                  Registre uma nova vacinação aplicada
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="animal">Animal</Label>
                  <Select value={newVaccination.animalId} onValueChange={(value) => setNewVaccination({...newVaccination, animalId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um animal" />
                    </SelectTrigger>
                    <SelectContent>
                      {animals.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id}>
                          {animal.name} ({animal.tag})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="vaccine">Vacina</Label>
                  <Select value={newVaccination.vaccine} onValueChange={(value) => setNewVaccination({...newVaccination, vaccine: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a vacina" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaccines.map((vaccine) => (
                        <SelectItem key={vaccine} value={vaccine}>
                          {vaccine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data da Aplicação</Label>
                    <Input
                      type="date"
                      value={newVaccination.date}
                      onChange={(e) => setNewVaccination({...newVaccination, date: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nextDue">Próxima Dose</Label>
                    <Input
                      type="date"
                      value={newVaccination.nextDue}
                      onChange={(e) => setNewVaccination({...newVaccination, nextDue: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="veterinarian">Veterinário</Label>
                  <Input
                    placeholder="Nome do veterinário"
                    value={newVaccination.veterinarian}
                    onChange={(e) => setNewVaccination({...newVaccination, veterinarian: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    placeholder="Observações sobre a vacinação..."
                    value={newVaccination.notes}
                    onChange={(e) => setNewVaccination({...newVaccination, notes: e.target.value})}
                  />
                </div>
                
                <Button onClick={handleAddVaccination} className="w-full">
                  Registrar Vacinação
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAnimalDialogOpen} onOpenChange={setIsAnimalDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Animal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Animal</DialogTitle>
                <DialogDescription>
                  Adicione um novo animal ao rebanho
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      placeholder="Nome do animal"
                      value={newAnimal.name}
                      onChange={(e) => setNewAnimal({...newAnimal, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tag">Brinco/Identificação</Label>
                    <Input
                      placeholder="BOV001, SUI001..."
                      value={newAnimal.tag}
                      onChange={(e) => setNewAnimal({...newAnimal, tag: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={newAnimal.type} onValueChange={(value: Animal['type']) => setNewAnimal({...newAnimal, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {animalTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Sexo</Label>
                    <Select value={newAnimal.gender} onValueChange={(value: Animal['gender']) => setNewAnimal({...newAnimal, gender: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="macho">Macho</SelectItem>
                        <SelectItem value="femea">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="breed">Raça</Label>
                  <Input
                    placeholder="Nelore, Angus, Large White..."
                    value={newAnimal.breed}
                    onChange={(e) => setNewAnimal({...newAnimal, breed: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      type="date"
                      value={newAnimal.birthDate}
                      onChange={(e) => setNewAnimal({...newAnimal, birthDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newAnimal.weight}
                      onChange={(e) => setNewAnimal({...newAnimal, weight: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    placeholder="Pasto 1, Pocilga A, Curral B..."
                    value={newAnimal.location}
                    onChange={(e) => setNewAnimal({...newAnimal, location: e.target.value})}
                  />
                </div>
                
                <Button onClick={handleAddAnimal} className="w-full">
                  Cadastrar Animal
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
            <CardTitle className="text-sm font-medium">Total de Animais</CardTitle>
            <Heart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animals.length}</div>
            <p className="text-xs text-muted-foreground">Animais cadastrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacinações Pendentes</CardTitle>
            <Syringe className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingVaccinations.length}</div>
            <p className="text-xs text-muted-foreground">Necessitam vacinação</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Animais Saudáveis</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {animals.filter(a => a.healthStatus === 'saudavel').length}
            </div>
            <p className="text-xs text-muted-foreground">Em bom estado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Tratamento</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {animals.filter(a => a.healthStatus === 'tratamento' || a.healthStatus === 'doente').length}
            </div>
            <p className="text-xs text-muted-foreground">Precisam cuidados</p>
          </CardContent>
        </Card>
      </div>

      {/* Vaccination Alerts */}
      {pendingVaccinations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Syringe className="h-5 w-5 text-red-600" />
              Vacinações Pendentes
            </CardTitle>
            <CardDescription>
              Animais que precisam ser vacinados urgentemente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingVaccinations.slice(0, 5).map(({ animal, vaccination }) => (
                <div key={`${animal.id}-${vaccination.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{animal.name} ({animal.tag})</h4>
                    <p className="text-sm text-muted-foreground">
                      Vacina: {vaccination.vaccine} - Vencimento: {new Date(vaccination.nextDue).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {getVaccinationStatusBadge(vaccination)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Animals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rebanho</CardTitle>
          <CardDescription>
            Lista completa dos animais cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead>Tipo/Raça</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Próxima Vacinação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animals.map((animal) => {
                const age = Math.floor((new Date().getTime() - new Date(animal.birthDate).getTime()) / (1000 * 3600 * 24 * 365));
                const nextVaccination = animal.vaccinations
                  .filter(v => v.status === 'pendente' || v.status === 'atrasada')
                  .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())[0];
                
                return (
                  <TableRow key={animal.id}>
                    <TableCell>
                      <div>
                        <div>{animal.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {animal.tag} - {animal.gender === 'macho' ? 'Macho' : 'Fêmea'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize">
                        {animal.type}
                        <div className="text-xs text-muted-foreground">{animal.breed}</div>
                      </div>
                    </TableCell>
                    <TableCell>{age} anos</TableCell>
                    <TableCell>{animal.weight} kg</TableCell>
                    <TableCell>{animal.location}</TableCell>
                    <TableCell>{getHealthStatusBadge(animal.healthStatus)}</TableCell>
                    <TableCell>
                      {nextVaccination ? (
                        <div>
                          <div className="text-sm">{nextVaccination.vaccine}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(nextVaccination.nextDue).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Em dia</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}