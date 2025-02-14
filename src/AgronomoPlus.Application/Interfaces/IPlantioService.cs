using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Application.Interfaces;

public interface IPlantioService
{
        Task<Plantio> CreateAsync(Plantio plantio);
        Task<IEnumerable<Plantio>> GetAllAsync();
        Task<Plantio> GetByIdAsync(Guid id);
        Task<Plantio> UpdateAsync(Guid id, Plantio plantio);
        Task<bool> DeleteAsync(Guid id);
}
