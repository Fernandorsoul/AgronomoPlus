using AgronomoPlus.Application.DTOs.Auth;
using AgronomoPlus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AgronomoPlus.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService ?? throw new ArgumentNullException(nameof(authService));
    }

    [HttpPost("login")]
    [AllowAnonymous] // Explicitamente permitir acesso sem autenticação
    public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequest)
    {
        if (loginRequest == null)
        {
            return BadRequest("Dados de login inválidos.");
        }

        var response = await _authService.LoginAsync(loginRequest);
        if (response == null)
        {
            return Unauthorized("Credenciais inválidas.");
        }

        return Ok(response);
    }
}
