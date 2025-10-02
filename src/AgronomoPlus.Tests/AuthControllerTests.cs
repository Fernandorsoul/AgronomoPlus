using AgronomoPlus.Api.Controllers;
using AgronomoPlus.Application.DTOs.Auth;
using AgronomoPlus.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace AgronomoPlus.Api.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _mockAuthService;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _mockAuthService = new Mock<IAuthService>();
        _controller = new AuthController(_mockAuthService.Object);
    }

    [Fact]
    public async Task Login_ComCredenciaisValidas_DeveRetornarOk()
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = "test@example.com", Senha = "password123" };
        var loginResponse = new LoginResponseDto
        {
            Token = "jwt-token-example",
            Email = loginRequest.Email,
            Role = "User",
            Expiration = System.DateTime.UtcNow.AddHours(1)
        };

        _mockAuthService.Setup(service => service.LoginAsync(loginRequest))
                       .ReturnsAsync(loginResponse);

        // Act
        var result = await _controller.Login(loginRequest);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<LoginResponseDto>(okResult.Value);
        Assert.Equal(loginResponse.Token, returnValue.Token);
        Assert.Equal(loginResponse.Email, returnValue.Email);
    }

    [Fact]
    public async Task Login_ComCredenciaisInvalidas_DeveRetornarUnauthorized()
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = "invalid@example.com", Senha = "wrongpassword" };

        _mockAuthService.Setup(service => service.LoginAsync(loginRequest))
                       .ReturnsAsync((LoginResponseDto)null);

        // Act
        var result = await _controller.Login(loginRequest);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Credenciais inválidas.", unauthorizedResult.Value);
    }

    [Fact]
    public async Task Login_ComRequestNulo_DeveRetornarBadRequest()
    {
        // Act
        var result = await _controller.Login(null);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Dados de login inválidos.", badRequestResult.Value);
    }
}
