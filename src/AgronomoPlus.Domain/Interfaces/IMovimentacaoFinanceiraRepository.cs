using AgronomoPlus.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AgronomoPlus.Domain.Interfaces;

public interface IMovimentacaoFinanceiraRepository : IGenericRepository<MovimentacaoFinanceira>
{
    Task<IEnumerable<MovimentacaoFinanceira>> GetByUsuarioIdAsync(Guid usuarioId);
    // Adicionar outros métodos específicos para MovimentacaoFinanceira, se necessário
}

