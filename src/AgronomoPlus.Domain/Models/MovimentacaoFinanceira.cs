namespace AgronomoPlus.Domain.Models;

/// <summary>
/// Modelo para movimentações financeiras.
/// Criado para resolver erro de compilação onde o tipo não era encontrado.
/// Representa transações financeiras associadas a usuários.
/// </summary>
public class MovimentacaoFinanceira
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public string TipoTransacao { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime DataTransacao { get; set; }

    // Relacionamento com Person (Usuario)
    public Person Usuario { get; set; } = null!;
}
