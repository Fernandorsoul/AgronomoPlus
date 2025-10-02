using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using AgronomoPlus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AgronomoPlus.Infrastructure.Repositories;

/// <summary>
/// Repositório para movimentações financeiras.
/// Implementa operações CRUD e consultas específicas para MovimentacaoFinanceira.
/// Corrigido: Adicionado namespace correto e implementação completa.
/// </summary>
public class MovimentacaoFinanceiraRepository : IMovimentacaoFinanceiraRepository
{
    private readonly AgroPlusDbContext _context;

    public MovimentacaoFinanceiraRepository(AgroPlusDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<IEnumerable<MovimentacaoFinanceira>> GetAllAsync()
    {
        return await _context.MovimentacoesFinanceiras
            .Include(m => m.Usuario)
            .ToListAsync();
    }

    public async Task<MovimentacaoFinanceira?> GetByIdAsync(Guid id)
    {
        return await _context.MovimentacoesFinanceiras
            .Include(m => m.Usuario)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task AddAsync(MovimentacaoFinanceira entity)
    {
        entity.Id = Guid.NewGuid();
        await _context.MovimentacoesFinanceiras.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public void Update(MovimentacaoFinanceira entity)
    {
        _context.MovimentacoesFinanceiras.Update(entity);
        _context.SaveChanges();
    }

    public void Delete(MovimentacaoFinanceira entity)
    {
        _context.MovimentacoesFinanceiras.Remove(entity);
        _context.SaveChanges();
    }

    public async Task<IEnumerable<MovimentacaoFinanceira>> GetByUsuarioIdAsync(Guid usuarioId)
    {
        return await _context.MovimentacoesFinanceiras
            .Include(m => m.Usuario)
            .Where(m => m.UsuarioId == usuarioId)
            .ToListAsync();
    }
}
