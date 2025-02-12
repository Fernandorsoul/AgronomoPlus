using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using AgronomoPlus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AgronomoPlus.Infrastructure.Repositories;

public class PragaOuDoencaRepository : IPragaOuDoencaRepository
{
    private readonly AgroPlusDbContext _context;
    public PragaOuDoencaRepository(AgroPlusDbContext agroPlusDb)
    {
        _context=agroPlusDb;
    }
    public async Task<IEnumerable<ControlePragasEDoencas>> GetAllPragas()
    {
        return await _context.ControlePragas.ToListAsync();
    }

    public async Task<ControlePragasEDoencas> GetPragasEDoencasById(Guid id)
    {
        return await _context.ControlePragas.FindAsync(id);
    }

    public async Task UpdateAsync(ControlePragasEDoencas controlePragas)
    {
        _context.ControlePragas.Update(controlePragas);
        await _context.SaveChangesAsync();
    }
    public async Task AddAsync(ControlePragasEDoencas controlePragas)
    {
        _context.ControlePragas.Add(controlePragas);
        await _context.SaveChangesAsync();
    }

    public async Task DeletePragas(Guid id)
    {
        var praga = await _context.ControlePragas.FindAsync(id);
        if(praga != null)
        {
            _context.ControlePragas.Remove(praga);
            await _context.SaveChangesAsync();
        }
    }
}
