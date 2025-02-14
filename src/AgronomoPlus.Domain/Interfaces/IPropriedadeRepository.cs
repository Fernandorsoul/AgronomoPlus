using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Domain.Interfaces;

public interface IPropriedadeRepository
{
    Task <IEnumerable<Propriedade>> AllPropriedades ();
    Task <Propriedade>GetPropriedadeById(Guid id);
    Task <Propriedade>AddAsync (Propriedade propriedade);
    Task<Propriedade> UpdateAsync(Propriedade propriedade);
    Task <bool>DeleteAsync(Guid id);
}
