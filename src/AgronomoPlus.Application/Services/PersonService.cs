using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Models;
using AgronomoPlus.Domain.Interfaces;

namespace AgronomoPlus.Application.Services
{
    public class PersonService : IPersonService
    {
        private readonly IPersonRepository _personRepository;

        public PersonService(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }

        public async Task<Person> CreateAsync(Person person)
        {
            person.Id = Guid.NewGuid();
            return await _personRepository.AddAsync(person);
        }

        public async Task<IEnumerable<Person>> GetAllAsync()
        {
            return await _personRepository.AllPersons();
        }

        public async Task<Person> GetByIdAsync(Guid id)
        {
            var usuario = await _personRepository.GetPersonById(id);
            if (usuario == null)
                throw new KeyNotFoundException("Usuário não encontrado.");

            return usuario;
        }

        public async Task<Person> UpdateAsync(Guid id, Person person)
        {
            var existingUser = await _personRepository.GetPersonById(id);
            if (existingUser == null)
                throw new KeyNotFoundException("Usuário não encontrado.");

            existingUser.Nome = person.Nome;
            existingUser.Email = person.Email;
            existingUser.Password = person.Password; // ⚠️ Idealmente, criptografar a senha aqui.

            return await _personRepository.UpdateAsync(existingUser);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existingUser = await _personRepository.GetPersonById(id);
            if (existingUser == null)
                throw new KeyNotFoundException("Usuário não encontrado.");

            return await _personRepository.DeleteAsync(id);
        }
    }
}
