using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Application.Services;

public class PlantioService : IPlantioService
{
    private readonly IPlantioRepository _plantioRepository;
    public PlantioService(IPlantioRepository plantioRepository)
    {
        _plantioRepository = plantioRepository;
    }
    public async Task<IEnumerable<Plantio>> GetAllAsync()
    {
        return await _plantioRepository.AllPlantios();
    }

    public async Task<Plantio> GetByIdAsync(Guid id)
    {
        var plantioById = await _plantioRepository.GetPlantioById(id);
        if(plantioById == null)
        {
            throw new KeyNotFoundException("Cultura não encontrada.");
        }
        return plantioById;

    }

    public async Task<Plantio> UpdateAsync(Guid id, Plantio plantio)
    {
        if (plantio == null)
                throw new ArgumentNullException(nameof(plantio));

            var plantioExistente = await _plantioRepository.GetPlantioById(id);
            if (plantioExistente == null)
                throw new KeyNotFoundException("Propriedade não encontrada.");

            // Atualiza os dados
            plantioExistente.TipoSemente = plantio.TipoSemente;
            plantioExistente.Adubacao = plantio.Adubacao;
            plantioExistente.CorrecaoSolo = plantio.CorrecaoSolo;
            plantioExistente.PrevisaoColheita = plantio.PrevisaoColheita;
            plantioExistente.DataCriacao = plantio.DataCriacao;
            plantioExistente.Propriedade = plantio.Propriedade;
            plantioExistente.TempoCrecimento = plantio.TempoCrecimento;
            plantioExistente.TipoSolo = plantio.TipoSolo;

            return await _plantioRepository.UpdateAsync(plantioExistente);
    }
    public async Task<Plantio> CreateAsync(Plantio plantio)
    {
        if (plantio == null)
                throw new ArgumentNullException(nameof(plantio));

            plantio.Id = Guid.NewGuid();
            return await _plantioRepository.AddAsync(plantio);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var plantio = await _plantioRepository.GetPlantioById(id);
            if (plantio == null)
                throw new KeyNotFoundException("Propriedade não encontrada.");

            return await _plantioRepository.DeleteAsync(id);
    }

    
}
