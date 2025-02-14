using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Domain.Interfaces;

public interface IPersonRepository
{
    Task <IEnumerable<Person>> AllPersons ();
    Task <Person> GetPersonById(Guid id);
    Task<Person> AddAsync (Person person);
    Task<Person> UpdateAsync(Person person);
    Task<bool> DeleteAsync(Guid id);
}
