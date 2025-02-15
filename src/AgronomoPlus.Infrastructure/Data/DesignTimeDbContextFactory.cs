using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AgronomoPlus.Infrastructure.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AgroPlusDbContext>
    {
        public AgroPlusDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AgroPlusDbContext>();
            // A string de conexão pode ser configurada de forma fixa ou obter do appsettings.json.
            optionsBuilder.UseNpgsql("Host=localhost;Database=agronomoPlusDB;Username=postgres;Password=1234");

            return new AgroPlusDbContext(optionsBuilder.Options);
        }
    }
}
