namespace AgronomoPlus.Domain.Models;

public class ControlePragasEDoencas
{
    public Guid Id { get; set; }  // UUID em vez de int
    public Guid PlantioId { get; set; }  // FK para Plantio (também será Guid)
    public string TipoPragaOuDoenca { get; set; }
    public string Descricao { get; set; }
    public string AcoesDeControle { get; set; }
    public DateTime DataRegistro { get; set; }

    public Plantio Plantio { get; set; }  // Relacionamento com Plantio
}
