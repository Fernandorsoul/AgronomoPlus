using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using AgronomoPlus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AgronomoPlus.Infrastructure.Repositories;

public class PropriedadeRepository : IPropriedadeRepository
{
    private readonly AgroPlusDbContext _context;
    public PropriedadeRepository(AgroPlusDbContext agroPlusDb)
    {
        _context=agroPlusDb;
    }
    

    public async Task<IEnumerable<Propriedade>> AllPropriedades()
    {
        return await _context.Propriedades.ToListAsync();
    }
    public async Task<Propriedade> GetPropriedadeById(Guid id)
    {
        return await _context.Propriedades.FindAsync(id);
    }
    public async Task<Propriedade> AddAsync(Propriedade propriedade)
    {
        _context.Propriedades.Add(propriedade);
        await _context.SaveChangesAsync();
        return propriedade;
    }

    public async Task<Propriedade> UpdateAsync(Propriedade propriedade)
    {
        _context.Propriedades.Update(propriedade);
        await _context.SaveChangesAsync();
        return propriedade;
    }
    public async Task<bool> DeleteAsync(Guid id)
    {
        var propriedade = await _context.Propriedades.FindAsync(id);
        if(propriedade!=null)
        {
            _context.Propriedades.Remove(propriedade);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }
}
