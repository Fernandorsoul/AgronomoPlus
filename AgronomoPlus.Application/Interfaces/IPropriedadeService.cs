using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Application.Interfaces;

public interface IPropriedadeService
{
        Task<Propriedade> CreateAsync(Propriedade propriedade);
        Task<IEnumerable<Propriedade>> GetAllAsync();
        Task<Propriedade> GetByIdAsync(Guid id);
        Task<Propriedade> UpdateAsync(Guid id, Propriedade propriedade);
        Task<bool> DeleteAsync(Guid id);
}
