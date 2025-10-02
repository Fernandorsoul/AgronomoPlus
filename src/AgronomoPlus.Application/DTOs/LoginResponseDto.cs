namespace AgronomoPlus.Application.DTOs.Auth;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // Adicionar o papel do usuário na resposta
}

