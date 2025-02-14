using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;

namespace AgronomoPlus.Application.Services
{
    public class PragaService : IPragaService
    {
        private readonly IPragaOuDoencaRepository _pragaRepository;

        public PragaService(IPragaOuDoencaRepository pragaRepository)
        {
            _pragaRepository = pragaRepository;
        }

        public async Task<ControlePragasEDoencas> CreateAsync(ControlePragasEDoencas pragasEDoencas)
        {
            pragasEDoencas.Id = Guid.NewGuid();
            await _pragaRepository.AddAsync(pragasEDoencas);
            
            return pragasEDoencas;
        }

        public async Task<IEnumerable<ControlePragasEDoencas>> GetAllPragas()
        {
            return await _pragaRepository.GetAllPragas();
            
        }

        public async Task<ControlePragasEDoencas> GetPragasById(Guid id)
        {
            var pragasEDoencas = await _pragaRepository.GetPragasEDoencasById(id);
            if (pragasEDoencas == null)
                throw new KeyNotFoundException("Praga não encontrada.");

            return pragasEDoencas;
        }

        public async Task<ControlePragasEDoencas> UpdateAsync(Guid id, ControlePragasEDoencas pragasEDoencas)
        {
            var existingPraga = await _pragaRepository.GetPragasEDoencasById(id);
            if (existingPraga == null)
                throw new KeyNotFoundException("Praga não encontrada.");

            existingPraga.TipoPragaOuDoenca = pragasEDoencas.TipoPragaOuDoenca;
            existingPraga.AcoesDeControle = pragasEDoencas.AcoesDeControle;
            existingPraga.Descricao = pragasEDoencas.Descricao; 

            await _pragaRepository.UpdateAsync(existingPraga);
            return existingPraga;
        }

        public async Task<bool> Delete(Guid id)
        {
            var existingUser = await _pragaRepository.GetPragasEDoencasById(id);
            if (existingUser == null)
                throw new KeyNotFoundException("Praga não encontrada.");

            await _pragaRepository.DeletePragas(id);
            return true;
        }
    }
}
