import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AgronomoPlus</h1>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/pessoas" className="hover:underline">Pessoas</Link></li>
            <li><Link to="/propriedades" className="hover:underline">Propriedades</Link></li>
            <li><Link to="/plantios" className="hover:underline">Plantios</Link></li>
            <li>
              <button
                onClick={() => navigate('/configuracao')}
                className="hover:underline bg-transparent border-none cursor-pointer text-white"
                aria-label="Configuração"
              >
                Configuração
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/perfil')}
                className="hover:underline bg-transparent border-none cursor-pointer text-white"
                aria-label="Perfil"
              >
                Perfil
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
