import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';
import { Dashboard } from './components/dashboard';
import { FinanceSection } from './components/finance-section';
import { SoilAnalysisSection } from './components/solo-analysis-section';
import { InventorySection } from './components/inventory-section';
import { AnimalsSection } from './components/animals-section';
import { SalesSection } from './components/sales-section';
import Pessoas from './pages/Pessoas';
import Propriedades from './pages/Propriedades';
import Plantios from './pages/Plantios';

type Section = 'dashboard' | 'finance' | 'soil' | 'inventory' | 'animals' | 'sales' | 'pessoas' | 'propriedades' | 'plantios';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
      case 'finance':
        return <FinanceSection />;
      case 'soil':
        return <SoilAnalysisSection />;
      case 'inventory':
        return <InventorySection />;
      case 'animals':
        return <AnimalsSection />;
      case 'sales':
        return <SalesSection />;
      case 'pessoas':
        return <Pessoas />;
      case 'propriedades':
        return <Propriedades />;
      case 'plantios':
        return <Plantios />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 flex flex-col">
          <header className="border-b p-4 flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">A+</span>
              </div>
              <h1>AgronomoPlus</h1>
            </div>
          </header>
          <div className="flex-1 p-6">
            {renderSection()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}