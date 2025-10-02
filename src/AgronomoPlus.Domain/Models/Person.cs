namespace AgronomoPlus.Domain.Models;

/// <summary>
/// Modelo para pessoa (usuário).
/// Adicionado campo Role para autenticação.
/// </summary>
public class Person
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "User"; // Adicionado para autenticação
    public DateTime DataCriacao { get; set; }
    public DateTime? UltimoAcesso { get; set; }
    public bool Ativo { get; set; }
}
