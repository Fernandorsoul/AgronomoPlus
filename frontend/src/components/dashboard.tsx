import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  DollarSign,
  TrendingUp,
  Package,
  Heart,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { propriedadeApi, plantioApi, personApi } from '../api';

type Section = 'dashboard' | 'finance' | 'soil' | 'inventory' | 'animals' | 'sales' | 'pessoas' | 'propriedades' | 'plantios';

interface DashboardProps {
  onNavigate: (section: Section) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [statsCards, setStatsCards] = useState([
    {
      title: "Propriedades Cadastradas",
      value: "0",
      change: "Carregando...",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Plantios Ativos",
      value: "0",
      change: "Carregando...",
      icon: Heart,
      color: "text-green-600",
    },
    {
      title: "Pessoas Cadastradas",
      value: "0",
      change: "Carregando...",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Análises de Solo",
      value: "0",
      change: "Carregando...",
      icon: DollarSign,
      color: "text-red-600",
    },
  ]);

  const [alerts, setAlerts] = useState([
    {
      type: "info",
      title: "Carregando dados...",
      message: "Aguarde enquanto carregamos as informações do sistema",
      action: () => {},
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [propriedades, plantios, pessoas] = await Promise.all([
          propriedadeApi.getAll(),
          plantioApi.getAll(),
          personApi.getAll(),
        ]);

        // Update stats cards with real data
        setStatsCards([
          {
            title: "Propriedades Cadastradas",
            value: propriedades.data?.length?.toString() || "0",
            change: "Total ativo",
            icon: Package,
            color: "text-blue-600",
          },
          {
            title: "Plantios Ativos",
            value: plantios.data?.length?.toString() || "0",
            change: "Em andamento",
            icon: Heart,
            color: "text-green-600",
          },
          {
            title: "Pessoas Cadastradas",
            value: pessoas.data?.length?.toString() || "0",
            change: "Usuários ativos",
            icon: TrendingUp,
            color: "text-purple-600",
          },
          {
            title: "Análises de Solo",
            value: "0", // Will be updated when API is available
            change: "Disponíveis",
            icon: DollarSign,
            color: "text-red-600",
          },
        ]);

        // Generate alerts based on data
        const newAlerts = [];

        if (propriedades.data?.length === 0) {
          newAlerts.push({
            type: "info",
            title: "Bem-vindo!",
            message: "Comece cadastrando sua primeira propriedade",
            action: () => onNavigate('propriedades'),
          });
        }

        if (plantios.data?.length === 0) {
          newAlerts.push({
            type: "info",
            title: "Pronto para plantar?",
            message: "Cadastre seus primeiros plantios",
            action: () => onNavigate('plantios'),
          });
        }

        if (newAlerts.length === 0) {
          newAlerts.push({
            type: "success",
            title: "Sistema Ativo",
            message: "Todos os dados estão sendo carregados corretamente",
            action: () => {},
          });
        }

        setAlerts(newAlerts);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setAlerts([
          {
            type: "error",
            title: "Erro de Conexão",
            message: "Não foi possível carregar os dados. Verifique a conexão com o servidor.",
            action: () => window.location.reload(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [onNavigate]);

  return (
    <div className="space-y-6">
      {/* Header with background image */}
      <div className="relative rounded-xl overflow-hidden h-48">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1692632477775-8a8f4410d425?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGZhcm0lMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NTg5MTU0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Rural farm"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="mb-2">Bem-vindo ao AgronomoPlus</h1>
            <p className="opacity-90">Gestão inteligente para sua propriedade rural</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Alertas Importantes
            </CardTitle>
            <CardDescription>
              Situações que precisam da sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <Button variant="outline" size="sm" onClick={alert.action}>
                  Ver
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('finance')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Registrar Movimentação Financeira
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('inventory')}
            >
              <Package className="h-4 w-4 mr-2" />
              Adicionar Item ao Estoque
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('animals')}
            >
              <Heart className="h-4 w-4 mr-2" />
              Agendar Vacinação
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('sales')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Registrar Venda
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}