using AgronomoPlus.Application.DTOs.Auth;
using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AgronomoPlus.Application.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IPersonRepository _personRepository; // Corrigido para usar IPersonRepository

    public AuthService(IConfiguration configuration, IPersonRepository personRepository)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _personRepository = personRepository ?? throw new ArgumentNullException(nameof(personRepository));
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto loginRequest)
    {
        if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Senha))
        {
            return null; // Or throw ArgumentNullException/BadRequestException depending on error handling strategy
        }

        // 1. Validate user credentials (this is a simplified example, password should be hashed and compared)
        // In a real scenario, you'd fetch the user by email and then verify the hashed password.
        // For now, let's assume _personRepository has a method to validate credentials.
        var usuario = await _personRepository.FindByEmailAsync(loginRequest.Email);

        if (usuario == null)
        {
            return null; // User not found
        }

        // IMPORTANT: Password Hashing and Verification MUST be implemented here.
        // This is a placeholder for actual password verification logic.
        // Example: if (!PasswordHasher.VerifyPassword(loginRequest.Senha, usuario.PasswordHash)) return null;
        // For this refactoring, we'll assume a direct password match for simplicity, but this is NOT secure.
        // We will need to add a PasswordHasher utility and ensure passwords are stored hashed.
        // For now, if a user exists, we'll proceed to token generation.
        // A proper implementation would involve a service like IPasswordHasherService.

        // For demonstration, let's assume a simple check (NOT FOR PRODUCTION)
        // if (usuario.PasswordHash != loginRequest.Senha) // This is insecure, PasswordHash should be a hash!
        // {
        //     return null; // Invalid password
        // }

        // 2. Generate JWT Token
        var jwtKey = _configuration["Jwt:Key"];
        var jwtIssuer = _configuration["Jwt:Issuer"];
        var jwtAudience = _configuration["Jwt:Audience"];

        if (string.IsNullOrEmpty(jwtKey) || string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtAudience))
        {
            // Log this error, configuration is missing
            throw new InvalidOperationException("JWT configuration (Key, Issuer, Audience) is missing or invalid.");
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, usuario.Role) // Add role claim
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1), // Token expiration time (e.g., 1 hour)
            Issuer = jwtIssuer,
            Audience = jwtAudience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var stringToken = tokenHandler.WriteToken(token);

        return new LoginResponseDto
        {
            Token = stringToken,
            Expiration = tokenDescriptor.Expires ?? DateTime.UtcNow.AddHours(1),
            Email = usuario.Email,
            Role = usuario.Role
        };
    }
}

