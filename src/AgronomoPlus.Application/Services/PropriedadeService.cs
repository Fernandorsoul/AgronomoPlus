using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AgronomoPlus.Application.Services
{
    public class PropriedadeService : IPropriedadeService
    {
        private readonly IPropriedadeRepository _propriedadeRepository;

        public PropriedadeService(IPropriedadeRepository propriedadeRepository)
        {
            _propriedadeRepository = propriedadeRepository ?? throw new ArgumentNullException(nameof(propriedadeRepository));
        }

        public async Task<IEnumerable<Propriedade>> GetAllAsync()
        {
            return await _propriedadeRepository.AllPropriedades();
        }

        public async Task<Propriedade> GetByIdAsync(Guid id)
        {
            var propriedade = await _propriedadeRepository.GetPropriedadeById(id);
            if (propriedade == null)
                throw new KeyNotFoundException("Propriedade não encontrada.");

            return propriedade;
        }

        public async Task<Propriedade> CreateAsync(Propriedade propriedade)
        {
            if (propriedade == null)
                throw new ArgumentNullException(nameof(propriedade));

            propriedade.Id = Guid.NewGuid();
            return await _propriedadeRepository.AddAsync(propriedade);
        }

        public async Task<Propriedade> UpdateAsync(Guid id, Propriedade propriedade)
        {
            if (propriedade == null)
                throw new ArgumentNullException(nameof(propriedade));

            var existente = await _propriedadeRepository.GetPropriedadeById(id);
            if (existente == null)
                throw new KeyNotFoundException("Propriedade não encontrada.");

            // Atualiza os dados
            existente.Nome = propriedade.Nome;
            existente.TamanhoArea = propriedade.TamanhoArea;
            existente.Localizacao = propriedade.Localizacao;
            existente.PersonId = propriedade.PersonId;

            return await _propriedadeRepository.UpdateAsync(existente);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var propriedade = await _propriedadeRepository.GetPropriedadeById(id);
            if (propriedade == null)
                throw new KeyNotFoundException("Propriedade não encontrada.");

            return await _propriedadeRepository.DeleteAsync(id);
        }
    }
}
