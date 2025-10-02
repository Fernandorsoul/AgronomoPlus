import React, { useEffect, useState } from 'react';
import type { Propriedade, Person } from '../api';
import { propriedadeApi, personApi } from '../api';

const Propriedades: React.FC = () => {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Propriedade>>({});

  useEffect(() => {
    loadPropriedades();
    loadPeople();
  }, []);

  const loadPropriedades = async () => {
    try {
      const response = await propriedadeApi.getAll();
      setPropriedades(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar propriedades');
      setLoading(false);
    }
  };

  const loadPeople = async () => {
    try {
      const response = await personApi.getAll();
      setPeople(response.data);
    } catch (err) {
      console.error('Erro ao carregar pessoas', err);
    }
  };

  const validateForm = () => {
    if (!formData.nome || formData.nome.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      return false;
    }
    if (!formData.localizacao || formData.localizacao.trim().length < 3) {
      setError('Localização deve ter pelo menos 3 caracteres');
      return false;
    }
    if (!formData.tamanhoArea || formData.tamanhoArea <= 0) {
      setError('Tamanho da área deve ser maior que 0');
      return false;
    }
    if (!formData.personId) {
      setError('Proprietário deve ser selecionado');
      return false;
    }
    return true;
  };

  const processFormData = (): Omit<Propriedade, 'id' | 'dataCriacao'> => {
    return {
      nome: formData.nome!.trim(),
      localizacao: formData.localizacao!.trim(),
      tamanhoArea: formData.tamanhoArea!,
      personId: formData.personId!
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    try {
      const processedData = processFormData();
      await propriedadeApi.create(processedData);
      setShowForm(false);
      setFormData({});
      loadPropriedades();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar propriedade');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      try {
        await propriedadeApi.delete(id);
        loadPropriedades();
      } catch (err) {
        setError('Erro ao excluir propriedade');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Propriedades</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? 'Cancelar' : 'Adicionar Propriedade'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Localização</label>
              <input
                type="text"
                value={formData.localizacao || ''}
                onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tamanho da Área (ha)</label>
              <input
                type="number"
                value={formData.tamanhoArea || ''}
                onChange={(e) => setFormData({ ...formData, tamanhoArea: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Proprietário</label>
              <select
                value={formData.personId || ''}
                onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Selecione um proprietário</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Salvar
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área (ha)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proprietário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {propriedades.map((propriedade) => (
              <tr key={propriedade.id}>
                <td className="px-6 py-4 whitespace-nowrap">{propriedade.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap">{propriedade.localizacao}</td>
                <td className="px-6 py-4 whitespace-nowrap">{propriedade.tamanhoArea}</td>
                <td className="px-6 py-4 whitespace-nowrap">{propriedade.person?.nome || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(propriedade.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Propriedades;
