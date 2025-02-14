using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using AgronomoPlus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AgronomoPlus.Infrastructure.Repositories;

public class PlantioRepository : IPlantioRepository
{
    private readonly AgroPlusDbContext _context;
    public PlantioRepository(AgroPlusDbContext agroPlusDb)
    {
        _context = agroPlusDb;
    }
    public async Task<IEnumerable<Plantio>> AllPlantios()
    {
        return await _context.Plantios.ToListAsync();
    }
        public async Task<Plantio> GetPlantioById(Guid id)
    {
        return await _context.Plantios.FindAsync(id);
    }

    public async Task<Plantio> UpdateAsync(Plantio plantio)
    {
        _context.Plantios.Update(plantio);
        await _context.SaveChangesAsync();
        return plantio;
    }
    public async Task <Plantio>AddAsync(Plantio plantio)
    {
        _context.Plantios.Add(plantio);
        await _context.SaveChangesAsync();
        return plantio;
    }

    

    public async Task<bool> DeleteAsync(Guid id)
    {
        var plantio = await _context.Plantios.FindAsync(id);
        if(plantio != null)
        {
            _context.Plantios.Remove(plantio);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }


}
