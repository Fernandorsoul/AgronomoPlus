using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Domain.Interfaces;

public interface IPlantioRepository
{
    Task <IEnumerable<Plantio>> AllPlantios ();
    Task <Plantio> GetPlantioById(Guid id);
    Task<Plantio> AddAsync (Plantio plantio);
    Task<Plantio> UpdateAsync(Plantio plantio);
    Task<bool> DeleteAsync(Guid id);
}
