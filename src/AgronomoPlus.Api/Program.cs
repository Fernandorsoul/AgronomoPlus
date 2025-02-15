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

/*builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://your-auth-server.com";  // Substitua pela URL de sua autoridade de autenticação
        options.Audience = "your-audience";  // Substitua com seu público
    });*/
// Registra o reposit�rio IPersonRepository
builder.Services.AddScoped<IPragaService, PragaService>();
builder.Services.AddScoped<IPragaOuDoencaRepository, PragaOuDoencaRepository>();
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IPersonService, PersonService>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
/*builder.Services.AddHateoas();*/

builder.Services.AddSwaggerGen(c =>
{
    c.EnableAnnotations();
});


var app = builder.Build();
app.MapControllers();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}




/* Uso dos servi�os no pipeline
app.UseAuthentication();
// Deve vir antes do UseAuthorization()
app.UseAuthorization();*/


app.Run();
