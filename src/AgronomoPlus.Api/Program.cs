// Arquivo Program.cs corrigido para funcionar com PostgreSQL.
// Problemas resolvidos:
// - Configuração correta do DbContext com PostgreSQL.
// - Registro de todos os serviços e repositórios necessários.
// - Adição de CORS para permitir requisições do frontend.
// - Configuração de autenticação JWT (comentada por enquanto).
// - Swagger habilitado para desenvolvimento.

using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Application.Services;
using AgronomoPlus.Infrastructure.Data;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Configuração dos serviços antes de construir o app

builder.Services.AddDbContext<AgroPlusDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adiciona o serviço de autenticação JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Jwt:Authority"];
        options.Audience = builder.Configuration["Jwt:Audience"];
    });

// Registra os serviços e repositórios
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IMovimentacaoFinanceiraService, MovimentacaoFinanceiraService>();
builder.Services.AddScoped<IMovimentacaoFinanceiraRepository, MovimentacaoFinanceiraRepository>();
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IPersonService, PersonService>();
builder.Services.AddScoped<IPragaService, PragaService>();
builder.Services.AddScoped<IPragaOuDoencaRepository, PragaOuDoencaRepository>();
builder.Services.AddScoped<IPropriedadeService, PropriedadeService>();
builder.Services.AddScoped<IPropriedadeRepository, PropriedadeRepository>();
builder.Services.AddScoped<IFinanceiroService, FinanceiroService>();
builder.Services.AddScoped<IFinanceiroRepository, FinanceiroRepository>();
builder.Services.AddScoped<IPlantioService, PlantioService>();
builder.Services.AddScoped<IPlantioRepository, PlantioRepository>();
builder.Services.AddScoped<IAnaliseDeSoloRepository, AnaliseDeSoloRepository>();
builder.Services.AddScoped<IAnaliseDeSoloService, AnaliseDeSoloService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddSwaggerGen(c =>
{
    c.EnableAnnotations();
});

// Adicionar CORS para permitir requisições do frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// Usar CORS
app.UseCors("AllowAll");

app.MapControllers();

// Redirecionar raiz para Swagger em desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

app.Run();
