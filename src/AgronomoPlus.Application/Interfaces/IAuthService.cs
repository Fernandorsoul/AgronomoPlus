using AgronomoPlus.Application.DTOs.Auth;
using System.Threading.Tasks;

namespace AgronomoPlus.Application.Interfaces
{
    /// <summary>
    /// Interface para serviços de autenticação.
    /// Movida para Application para resolver dependências circulares com DTOs.
    /// </summary>
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto loginRequest);
        // Futuramente, podemos adicionar RegisterAsync, RefreshTokenAsync, etc.
    }
}
