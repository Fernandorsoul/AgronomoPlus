using AgronomoPlus.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AgronomoPlus.Application.Interfaces
{
    /// <summary>
    /// Interface para serviços de movimentação financeira.
    /// Movida para Application para manter consistência com outras interfaces de serviço.
    /// </summary>
    public interface IMovimentacaoFinanceiraService
    {
        Task<IEnumerable<MovimentacaoFinanceira>> GetAllAsync();
        Task<MovimentacaoFinanceira?> GetByIdAsync(System.Guid id);
        Task<MovimentacaoFinanceira> CreateAsync(MovimentacaoFinanceira movimentacao);
        Task<MovimentacaoFinanceira?> UpdateAsync(System.Guid id, MovimentacaoFinanceira movimentacao);
        Task<bool> DeleteAsync(System.Guid id);
        Task<IEnumerable<MovimentacaoFinanceira>> GetByUsuarioIdAsync(System.Guid usuarioId);
    }
}
