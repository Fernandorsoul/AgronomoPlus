using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using AgronomoPlus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AgronomoPlus.Domain.Repository;

public class PersonRepository : IPersonRepository
{
    private readonly AgroPlusDbContext _context;
    public PersonRepository(AgroPlusDbContext agroPlusDb)
    {
        _context=agroPlusDb;
    }
    public async Task<IEnumerable<Person>> AllPersons()
    {
        return await _context.People.ToListAsync();
    }
    public async Task<Person> GetPersonById(Guid id)
    {
        return await _context.People.FindAsync(id);
    }
    public async Task<Person> AddAsync(Person person)
    {
        _context.People.Add(person);
        await _context.SaveChangesAsync();
        return person;
    }

    public async Task<Person> UpdateAsync(Person person)
    {
        _context.People.Update(person);
        await _context.SaveChangesAsync();
        return person;
    }
    
    public async Task<bool> DeleteAsync(Guid id)
    {
        var person = await _context.People.FindAsync(id);
        if(person != null)
        {
            _context.People.Remove(person);
            await _context.SaveChangesAsync();
        }
        return true;
    }

    
}
