using AgronomoPlus.Application.DTOs.Auth;
using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Application.Services;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace AgronomoPlus.Application.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly Mock<IPersonRepository> _mockPersonRepository;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockConfiguration = new Mock<IConfiguration>();
        _mockPersonRepository = new Mock<IPersonRepository>();

        // Setup mock configuration for JWT
        var jwtSettings = new Dictionary<string, string?>
        {
            {"Jwt:Key", "TestKeySuperSecretSuperLongEnoughForHmacSha256"},
            {"Jwt:Issuer", "TestIssuer"},
            {"Jwt:Audience", "TestAudience"}
        };
        var configurationSection = new Mock<IConfigurationSection>();
        configurationSection.Setup(x => x.Value).Returns(jwtSettings["Jwt:Key"]);
        _mockConfiguration.Setup(x => x.GetSection("Jwt:Key")).Returns(configurationSection.Object);
        
        var configurationSectionIssuer = new Mock<IConfigurationSection>();
        configurationSectionIssuer.Setup(x => x.Value).Returns(jwtSettings["Jwt:Issuer"]);
         _mockConfiguration.Setup(x => x.GetSection("Jwt:Issuer")).Returns(configurationSectionIssuer.Object);

        var configurationSectionAudience = new Mock<IConfigurationSection>();
        configurationSectionAudience.Setup(x => x.Value).Returns(jwtSettings["Jwt:Audience"]);
        _mockConfiguration.Setup(x => x.GetSection("Jwt:Audience")).Returns(configurationSectionAudience.Object);

        // Mock IConfiguration indexer access used in AuthService
        _mockConfiguration.Setup(c => c["Jwt:Key"]).Returns(jwtSettings["Jwt:Key"]);
        _mockConfiguration.Setup(c => c["Jwt:Issuer"]).Returns(jwtSettings["Jwt:Issuer"]);
        _mockConfiguration.Setup(c => c["Jwt:Audience"]).Returns(jwtSettings["Jwt:Audience"]);

        _authService = new AuthService(_mockConfiguration.Object, _mockPersonRepository.Object);
    }

    [Fact]
    public async Task LoginAsync_ComCredenciaisValidas_DeveRetornarLoginResponseDtoComToken()
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = "test@example.com", Senha = "password123" }; // Senha não é verificada de forma segura no AuthService atual
        var person = new Person { Id = Guid.NewGuid(), Email = loginRequest.Email, Password = "hashedpassword", Role = "User" }; // Password não é usado na lógica atual do AuthService para validação

        _mockPersonRepository.Setup(repo => repo.FindByEmailAsync(loginRequest.Email))
                              .ReturnsAsync(person);
        
        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        Assert.NotNull(result);
        Assert.False(string.IsNullOrEmpty(result.Token));
        Assert.Equal(person.Email, result.Email);
        Assert.Equal(person.Role, result.Role);
        Assert.True(result.Expiration > DateTime.UtcNow);
    }

    [Fact]
    public async Task LoginAsync_ComUsuarioNaoEncontrado_DeveRetornarNull()
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = "nonexistent@example.com", Senha = "password123" };
        _mockPersonRepository.Setup(repo => repo.FindByEmailAsync(loginRequest.Email))
                              .ReturnsAsync((Person?)null);

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task LoginAsync_ComLoginRequestNulo_DeveRetornarNull()
    {
        // Act
        var result = await _authService.LoginAsync(null!);

        // Assert
        Assert.Null(result);
    }

    [Theory]
    [InlineData("", "password")]
    [InlineData("test@example.com", "")]
    [InlineData(null, "password")]
    [InlineData("test@example.com", null)]
    public async Task LoginAsync_ComEmailOuSenhaInvalidosNoRequest_DeveRetornarNull(string email, string senha)
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = email, Senha = senha };

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task LoginAsync_ComConfiguracaoJwtAusente_DeveLancarInvalidOperationException()
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = "test@example.com", Senha = "password123" };
        var person = new Person { Id = Guid.NewGuid(), Email = loginRequest.Email, Password = "hashedpassword", Role = "User" };
        _mockPersonRepository.Setup(repo => repo.FindByEmailAsync(loginRequest.Email)).ReturnsAsync(person);

        // Sabotar a configuração do JWT para este teste
        _mockConfiguration.Setup(c => c["Jwt:Key"]).Returns((string?)null); 

        var authServiceComConfigInvalida = new AuthService(_mockConfiguration.Object, _mockPersonRepository.Object);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => authServiceComConfigInvalida.LoginAsync(loginRequest));
    }
}

