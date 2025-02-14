using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AgronomoPlus.Infrastructure.Repositories;

public class FinanceiroRepository : IFinanceiroRepository
{
    private readonly AgroPlusDbContext _context;
    public FinanceiroRepository(AgroPlusDbContext agroPlusDb)
    {
        _context = agroPlusDb;
    }
    public async Task<IEnumerable<ControleFinanceiro>> GetFinanceiros()
    {
        return await _context.Financeiros.ToListAsync();
    }
    public async Task<ControleFinanceiro> GetFinanceiroById(Guid id)
    {
        return await _context.Financeiros.FindAsync(id);
    }
    public async Task<ControleFinanceiro> UpdateFinanceiro(ControleFinanceiro controle)
    {
        _context.Financeiros.Update(controle);
        await _context.SaveChangesAsync();
        return controle;
    }
    public async Task<ControleFinanceiro> AddAsync(ControleFinanceiro controle)
    {
        _context.Financeiros.Add(controle);
        await _context.SaveChangesAsync();
        return controle;
    }
    public async Task<bool> RemoveFinanceiro(Guid id)
    {
        var financeiro = await _context.Financeiros.FindAsync(id);
        if(financeiro != null)
        {
            _context.Financeiros.Remove(financeiro);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }
}
