using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Application.Services;

public class AnaliseDeSoloService : IAnaliseDeSoloService
{
    private readonly IAnaliseDeSoloRepository _analiseDeSoloRepository;

    public AnaliseDeSoloService(IAnaliseDeSoloRepository analiseDeSoloRepository)
    {
        _analiseDeSoloRepository = analiseDeSoloRepository;
    }

    public async Task<ComposicaoDeSolo> CreateAsync(ComposicaoDeSolo analise)
    {
        await _analiseDeSoloRepository.AddAsync(analise);
        return analise;
    }

    public async Task<IEnumerable<ComposicaoDeSolo>> GetAllAsync()
    {
        return await _analiseDeSoloRepository.GetAnalisesDeSolo();
    }

    public async Task<ComposicaoDeSolo> GetByIdAsync(Guid id)
    {
        return await _analiseDeSoloRepository.GetAnaliseDeSoloById(id);
    }

    public async Task<ComposicaoDeSolo> UpdateAsync(Guid id, ComposicaoDeSolo analise)
    {
        var existing = await _analiseDeSoloRepository.GetAnaliseDeSoloById(id);
        if (existing == null)
            throw new KeyNotFoundException("Análise de solo não encontrada");

        analise.Id = id;
        await _analiseDeSoloRepository.UpdateAnalise(analise);
        return analise;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existing = await _analiseDeSoloRepository.GetAnaliseDeSoloById(id);
        if (existing == null)
            return false;

        await _analiseDeSoloRepository.RemoveAnalise(id);
        return true;
    }
}
