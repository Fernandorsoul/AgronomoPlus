using AgronomoPlus.Domain.Models;

public class ControleFinanceiro
{
    public Guid Id { get; set; }  // UUID em vez de int
    public Guid PropriedadeId { get; set; }  // FK para Propriedade (também será Guid)
    public string TipoTransacao { get; set; }
    public string Descricao { get; set; }
    public decimal Valor { get; set; }
    public DateTime DataTransacao { get; set; }

    public Propriedade Propriedade { get; set; }  // Relacionamento com Propriedade
}
