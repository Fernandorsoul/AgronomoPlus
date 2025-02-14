using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Application.Services;
using AgronomoPlus.Infrastructure.Data;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using AgronomoPlus.Domain.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Configura��o dos servi�os antes de construir o app

builder.Services.AddDbContext<AgroPlusDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


// Adiciona o servi�o de autoriza��o

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://your-auth-server.com";  // Substitua pela URL de sua autoridade de autenticação
        options.Audience = "your-audience";  // Substitua com seu público
    });
// Registra o reposit�rio IPersonRepository
builder.Services.AddScoped<IPersonRepository, PersonRepository>();

var app = builder.Build();

// Uso dos servi�os no pipeline
app.UseAuthentication(); // Deve vir antes do UseAuthorization()
app.UseAuthorization();

app.Run();
