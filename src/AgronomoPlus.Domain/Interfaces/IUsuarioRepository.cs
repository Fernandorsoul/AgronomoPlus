using AgronomoPlus.Domain.Models;
using System;
using System.Threading.Tasks;

namespace AgronomoPlus.Domain.Interfaces;

/// <summary>
/// Interface para repositório de usuários (Person).
/// Corrigido para usar Person em vez de Usuario inexistente.
/// </summary>
public interface IUsuarioRepository : IGenericRepository<Person>
{
    Task<Person?> FindByEmailAsync(string email);
    // Add other specific methods for Person if needed, e.g., GetByUsernameAsync, etc.
}

/// <summary>
/// Interface genérica para repositórios.
/// Definida aqui para uso comum.
/// </summary>
public interface IGenericRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Update(T entity); // EF Core tracks changes, so often no async needed for update itself
    void Delete(T entity);
    // Task<int> SaveChangesAsync(); // Often part of Unit of Work pattern
}

