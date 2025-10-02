using AgronomoPlus.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace AgronomoPlus.Infrastructure.Data;

/// <summary>
/// Contexto de banco de dados para o sistema AgronomoPlus.
/// Corrigido: Mudou DbSet<Pessoa> para DbSet<Person> para corresponder ao modelo.
/// Adicionado DbSet<MovimentacaoFinanceira> para o novo modelo.
/// </summary>
public class AgroPlusDbContext : DbContext
{
    public AgroPlusDbContext(DbContextOptions<AgroPlusDbContext> options) : base(options)
    {
    }
    public DbSet<Person> People { get; set; }
    public DbSet<Propriedade> Propriedades { get; set; }
    public DbSet<Plantio> Plantios { get; set; }
    public DbSet<ControlePragasEDoencas> ControlePragas { get; set; }
    public DbSet<ControleFinanceiro> Financeiros { get; set; }
    public DbSet<ComposicaoDeSolo> Analises { get; set; }
    public DbSet<MovimentacaoFinanceira> MovimentacoesFinanceiras { get; set; }
}
