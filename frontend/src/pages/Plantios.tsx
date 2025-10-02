import React, { useEffect, useState } from 'react';
import type { Plantio, Propriedade } from '../api';
import { plantioApi, propriedadeApi } from '../api';

const Plantios: React.FC = () => {
  const [plantios, setPlantios] = useState<Plantio[]>([]);
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Plantio>>({});

  useEffect(() => {
    loadPlantios();
    loadPropriedades();
  }, []);

  const loadPlantios = async () => {
    try {
      const response = await plantioApi.getAll();
      setPlantios(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar plantios');
      setLoading(false);
    }
  };

  const loadPropriedades = async () => {
    try {
      const response = await propriedadeApi.getAll();
      setPropriedades(response.data);
    } catch (err) {
      console.error('Erro ao carregar propriedades', err);
    }
  };

  const validateForm = () => {
    if (!formData.tipoSemente || formData.tipoSemente.trim().length < 2) {
      setError('Tipo de semente deve ter pelo menos 2 caracteres');
      return false;
    }
    if (!formData.tipoSolo || formData.tipoSolo.trim().length < 2) {
      setError('Tipo de solo deve ter pelo menos 2 caracteres');
      return false;
    }
    if (!formData.correcaoSolo || formData.correcaoSolo.trim().length < 2) {
      setError('Correção do solo deve ter pelo menos 2 caracteres');
      return false;
    }
    if (!formData.adubacao || formData.adubacao.trim().length < 2) {
      setError('Adubação deve ter pelo menos 2 caracteres');
      return false;
    }
    if (!formData.tempoCrecimento || formData.tempoCrecimento <= 0) {
      setError('Tempo de crescimento deve ser maior que 0');
      return false;
    }
    if (!formData.propriedadeId) {
      setError('Propriedade deve ser selecionada');
      return false;
    }
    return true;
  };

  const processFormData = (): Omit<Plantio, 'id' | 'dataCriacao'> => {
    return {
      tipoSemente: formData.tipoSemente!.trim(),
      tipoSolo: formData.tipoSolo!.trim(),
      correcaoSolo: formData.correcaoSolo!.trim(),
      adubacao: formData.adubacao!.trim(),
      tempoCrecimento: formData.tempoCrecimento!,
      previsaoColheita: formData.previsaoColheita || undefined,
      propriedadeId: formData.propriedadeId!
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    try {
      const processedData = processFormData();
      await plantioApi.create(processedData);
      setShowForm(false);
      setFormData({});
      loadPlantios();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar plantio');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      try {
        await plantioApi.delete(id);
        loadPlantios();
      } catch (err) {
        setError('Erro ao excluir plantio');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Plantios</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? 'Cancelar' : 'Adicionar Plantio'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Semente</label>
              <input
                type="text"
                value={formData.tipoSemente || ''}
                onChange={(e) => setFormData({ ...formData, tipoSemente: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Solo</label>
              <input
                type="text"
                value={formData.tipoSolo || ''}
                onChange={(e) => setFormData({ ...formData, tipoSolo: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correção do Solo</label>
              <input
                type="text"
                value={formData.correcaoSolo || ''}
                onChange={(e) => setFormData({ ...formData, correcaoSolo: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adubação</label>
              <input
                type="text"
                value={formData.adubacao || ''}
                onChange={(e) => setFormData({ ...formData, adubacao: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tempo de Crescimento (dias)</label>
              <input
                type="number"
                value={formData.tempoCrecimento || ''}
                onChange={(e) => setFormData({ ...formData, tempoCrecimento: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Previsão de Colheita</label>
              <input
                type="date"
                value={formData.previsaoColheita || ''}
                onChange={(e) => setFormData({ ...formData, previsaoColheita: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Propriedade</label>
              <select
                value={formData.propriedadeId || ''}
                onChange={(e) => setFormData({ ...formData, propriedadeId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Selecione uma propriedade</option>
                {propriedades.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.nome} - {prop.localizacao}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Semente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Solo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correção Solo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adubação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo Crescimento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriedade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plantios.map((plantio) => (
              <tr key={plantio.id}>
                <td className="px-6 py-4 whitespace-nowrap">{plantio.tipoSemente}</td>
                <td className="px-6 py-4 whitespace-nowrap">{plantio.tipoSolo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{plantio.correcaoSolo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{plantio.adubacao}</td>
                <td className="px-6 py-4 whitespace-nowrap">{plantio.tempoCrecimento} dias</td>
                <td className="px-6 py-4 whitespace-nowrap">{plantio.propriedade?.nome || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(plantio.id)}
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

export default Plantios;
