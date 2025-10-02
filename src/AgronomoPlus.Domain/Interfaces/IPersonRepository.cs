using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Domain.Interfaces;

/// <summary>
/// Interface para repositório de pessoas.
/// Adicionado método FindByEmailAsync para autenticação.
/// </summary>
public interface IPersonRepository
{
    Task<IEnumerable<Person>> AllPersons();
    Task<Person> GetPersonById(Guid id);
    Task<Person> AddAsync(Person person);
    Task<Person> UpdateAsync(Person person);
    Task<bool> DeleteAsync(Guid id);
    Task<Person?> FindByEmailAsync(string email);
}
