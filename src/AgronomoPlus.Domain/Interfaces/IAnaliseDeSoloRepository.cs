using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Domain.Interfaces;

public interface IAnaliseDeSoloRepository
{
    Task<IEnumerable<ComposicaoDeSolo>> GetAnalisesDeSolo ();
    Task<ComposicaoDeSolo> GetAnaliseDeSoloById(Guid id);
    Task AddAsync (ComposicaoDeSolo analise);
    Task UpdateAnalise (ComposicaoDeSolo analise);
    Task RemoveAnalise(Guid id);
}
