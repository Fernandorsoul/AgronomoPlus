import {
  Home,
  DollarSign,
  TestTube,
  Package,
  Heart,
  ShoppingCart,
  Settings,
  User,
  MapPin,
  Sprout
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from './ui/sidebar';

type Section = 'dashboard' | 'finance' | 'soil' | 'inventory' | 'animals' | 'sales' | 'pessoas' | 'propriedades' | 'plantios';

interface AppSidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    section: 'dashboard' as Section,
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    section: 'finance' as Section,
  },
  {
    title: "Análise de Solo",
    icon: TestTube,
    section: 'soil' as Section,
  },
  {
    title: "Estoque",
    icon: Package,
    section: 'inventory' as Section,
  },
  {
    title: "Animais",
    icon: Heart,
    section: 'animals' as Section,
  },
  {
    title: "Vendas",
    icon: ShoppingCart,
    section: 'sales' as Section,
  },
  {
    title: "Pessoas",
    icon: User,
    section: 'pessoas' as Section,
  },
  {
    title: "Propriedades",
    icon: MapPin,
    section: 'propriedades' as Section,
  },
  {
    title: "Plantios",
    icon: Sprout,
    section: 'plantios' as Section,
  },
];

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão Rural</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.section}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.section)}
                    isActive={activeSection === item.section}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User />
              <span>Perfil</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}