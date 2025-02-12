using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Domain.Interfaces;

public interface IAnaliseDeSoloRepository
{
    Task<IEnumerable<AnaliseDeSolo>> GetAnalisesDeSolo ();
    Task<AnaliseDeSolo> GetAnaliseDeSoloById(Guid id);
    Task AddAsync (AnaliseDeSolo analise);
    Task UpdateAnalise (AnaliseDeSolo analise);
    Task RemoveAnalise(Guid id);
}
