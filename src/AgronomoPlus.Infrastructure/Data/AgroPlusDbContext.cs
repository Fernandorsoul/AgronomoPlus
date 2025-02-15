using AgronomoPlus.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace AgronomoPlus.Infrastructure.Data;

public class AgroPlusDbContext : DbContext
{
    public AgroPlusDbContext(DbContextOptions<AgroPlusDbContext>options):base(options)
    {
    }
    public DbSet<Person> People{get;set;}
    public DbSet<Propriedade> Propriedades{get;set;}
    public DbSet<Plantio>Plantios{get;set;}
    public DbSet<ControlePragasEDoencas>ControlePragas{get;set;}
    public DbSet<ControleFinanceiro> Financeiros{get;set;}
    public DbSet<AnaliseDeSolo> Analises {get;set;}
}
