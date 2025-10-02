import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">Bem-vindo ao AgronomoPlus! Gerencie suas propriedades, plantios e muito mais.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Pessoas</h2>
          <p>Gerencie usuários e clientes</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Propriedades</h2>
          <p>Administre suas fazendas e terrenos</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Plantios</h2>
          <p>Acompanhe seus cultivos</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
