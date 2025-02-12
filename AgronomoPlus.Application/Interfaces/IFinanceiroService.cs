namespace AgronomoPlus.Application.Interfaces;

public interface IFinanceiroService
{
        Task<ControleFinanceiro> CreateAsync(ControleFinanceiro financeiro);
        Task<IEnumerable<ControleFinanceiro>> GetAllAsync();
        Task<ControleFinanceiro> GetByIdAsync(Guid id);
        Task<ControleFinanceiro> UpdateAsync(Guid id, ControleFinanceiro financeiro);
        Task<bool> DeleteAsync(Guid id);
}
