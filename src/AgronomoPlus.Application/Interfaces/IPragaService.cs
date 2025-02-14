using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Application.Interfaces
{
    public interface IPragaService
    {
        Task<IEnumerable<ControlePragasEDoencas>> GetAllPragas();
        Task<ControlePragasEDoencas> GetPragasById(Guid id);
        Task<ControlePragasEDoencas> CreateAsync(ControlePragasEDoencas pragasEDoencas);
        Task<ControlePragasEDoencas> UpdateAsync(Guid id, ControlePragasEDoencas pragasEDoencas);
        Task<bool> Delete(Guid id);
    }
}
