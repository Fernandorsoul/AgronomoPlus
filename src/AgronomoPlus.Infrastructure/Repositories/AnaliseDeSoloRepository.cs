using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using AgronomoPlus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AgronomoPlus.Infrastructure.Repositories;

public class AnaliseDeSoloRepository : IAnaliseDeSoloRepository
{
    private readonly AgroPlusDbContext _context;
    public AnaliseDeSoloRepository(AgroPlusDbContext agroPlusDb)
    {
        _context = agroPlusDb;
    }
    
    public async Task<IEnumerable<ComposicaoDeSolo>> GetAnalisesDeSolo()
    {
        return await _context.Analises.ToListAsync();
    }
    public async Task<ComposicaoDeSolo> GetAnaliseDeSoloById(Guid id)
    {
        return await _context.Analises.FindAsync(id);
    }

    public async Task AddAsync(ComposicaoDeSolo analise)
    {
        _context.Analises.Add(analise);
        await _context.SaveChangesAsync();
    }
    public async Task UpdateAnalise(ComposicaoDeSolo analise)
    {
        _context.Analises.Update(analise);
        await _context.SaveChangesAsync();
    }
    public async Task RemoveAnalise(Guid id)
    {
        var rmvAnalise = await _context.Analises.FindAsync(id);
        if(rmvAnalise != null)
        {
            _context.Analises.Remove(rmvAnalise);
            await _context.SaveChangesAsync();
        }
    }

    
}
