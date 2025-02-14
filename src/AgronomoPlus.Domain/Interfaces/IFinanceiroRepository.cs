namespace AgronomoPlus.Domain.Interfaces;

public interface IFinanceiroRepository
{
    Task<IEnumerable<ControleFinanceiro>> GetFinanceiros ();
    Task<ControleFinanceiro> GetFinanceiroById(Guid id);
    Task <ControleFinanceiro>AddAsync (ControleFinanceiro controle);
    Task<ControleFinanceiro> UpdateFinanceiro (ControleFinanceiro controle);
    Task<bool> RemoveFinanceiro(Guid id);
}
