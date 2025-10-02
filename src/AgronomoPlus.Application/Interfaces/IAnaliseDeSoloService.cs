using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Application.Interfaces;

public interface IAnaliseDeSoloService
{
    Task<ComposicaoDeSolo> CreateAsync(ComposicaoDeSolo analise);
    Task<IEnumerable<ComposicaoDeSolo>> GetAllAsync();
    Task<ComposicaoDeSolo> GetByIdAsync(Guid id);
    Task<ComposicaoDeSolo> UpdateAsync(Guid id, ComposicaoDeSolo analise);
    Task<bool> DeleteAsync(Guid id);
}
