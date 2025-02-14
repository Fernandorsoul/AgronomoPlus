using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Application.Interfaces;

public interface IPersonService
{
        Task<Person> CreateAsync(Person person);
        Task<IEnumerable<Person>> GetAllAsync();
        Task<Person> GetByIdAsync(Guid id);
        Task<Person> UpdateAsync(Guid id, Person person);
        Task<bool> DeleteAsync(Guid id);
}
