using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Domain.Interfaces;

public interface IPragaOuDoencaRepository
{
    Task<IEnumerable<ControlePragasEDoencas>> GetAllPragas ();
    Task<ControlePragasEDoencas>GetPragasEDoencasById (Guid id);
    Task AddAsync (ControlePragasEDoencas controlePragas);
    Task UpdateAsync (ControlePragasEDoencas controlePragas);
    Task DeletePragas(Guid id);
}
