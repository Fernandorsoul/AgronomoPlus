using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Models;
using AgronomoPlus.Domain.Interfaces;

namespace AgronomoPlus.Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IPersonRepository _usuarioRepository;

        public UsuarioService(IPersonRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<Person> CreateAsync(Person person)
        {
            person.Id = Guid.NewGuid();
            return await _usuarioRepository.AddAsync(person);
        }

        public async Task<IEnumerable<Person>> GetAllAsync()
        {
            return await _usuarioRepository.AllPersons();
        }

        public async Task<Person> GetByIdAsync(Guid id)
        {
            var usuario = await _usuarioRepository.GetPersonById(id);
            if (usuario == null)
                throw new KeyNotFoundException("Usuário não encontrado.");

            return usuario;
        }

        public async Task<Person> UpdateAsync(Guid id, Person person)
        {
            var existingUser = await _usuarioRepository.GetPersonById(id);
            if (existingUser == null)
                throw new KeyNotFoundException("Usuário não encontrado.");

            existingUser.Nome = person.Nome;
            existingUser.Email = person.Email;
            existingUser.Password = person.Password; // ⚠️ Idealmente, criptografar a senha aqui.

            return await _usuarioRepository.UpdateAsync(existingUser);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existingUser = await _usuarioRepository.GetPersonById(id);
            if (existingUser == null)
                throw new KeyNotFoundException("Usuário não encontrado.");

            return await _usuarioRepository.DeleteAsync(id);
        }
    }
}
