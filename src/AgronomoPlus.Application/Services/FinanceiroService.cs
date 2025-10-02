using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AgronomoPlus.Application.Services
{
    public class FinanceiroService : IFinanceiroService
    {
        private readonly IFinanceiroRepository _financeiroRepository;

        public FinanceiroService(IFinanceiroRepository financeiroRepository)
        {
            _financeiroRepository = financeiroRepository ?? throw new ArgumentNullException(nameof(financeiroRepository));
        }

        public async Task<IEnumerable<ControleFinanceiro>> GetAllAsync()
        {
            return await _financeiroRepository.GetFinanceiros();
        }

        public async Task<ControleFinanceiro> GetByIdAsync(Guid id)
        {
            var financeiro = await _financeiroRepository.GetFinanceiroById(id);
            if (financeiro == null)
                throw new KeyNotFoundException("Registro financeiro não encontrado.");

            return financeiro;
        }

        public async Task<ControleFinanceiro> CreateAsync(ControleFinanceiro financeiro)
        {
            if (financeiro == null)
                throw new ArgumentNullException(nameof(financeiro));

            financeiro.Id = Guid.NewGuid();
            financeiro.DataTransacao = DateTime.UtcNow;

            return await _financeiroRepository.AddAsync(financeiro);
        }

        public async Task<ControleFinanceiro> UpdateAsync(Guid id, ControleFinanceiro financeiro)
        {
            if (financeiro == null)
                throw new ArgumentNullException(nameof(financeiro));

            var existente = await _financeiroRepository.GetFinanceiroById(id);
            if (existente == null)
                throw new KeyNotFoundException("Registro financeiro não encontrado.");

            // Atualiza os dados
            existente.TipoTransacao = financeiro.TipoTransacao;
            existente.Valor = financeiro.Valor;
            existente.Descricao = financeiro.Descricao;
            existente.DataTransacao = financeiro.DataTransacao;

            return await _financeiroRepository.UpdateFinanceiro(existente);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var financeiro = await _financeiroRepository.GetFinanceiroById(id);
            if (financeiro == null)
                throw new KeyNotFoundException("Registro financeiro não encontrado.");

            return await _financeiroRepository.RemoveFinanceiro(id);
        }

        public async Task<decimal> GetSaldoTotalAsync()
        {
            var transacoes = await _financeiroRepository.GetFinanceiros();
            return transacoes.Sum(t => t.TipoTransacao == "Entrada" ? t.Valor : -t.Valor);
        }

        public async Task<IEnumerable<ControleFinanceiro>> GetRelatorioPorPeriodoAsync(DateTime inicio, DateTime fim)
        {
            var transacoes = await _financeiroRepository.GetFinanceiros();
            return transacoes.Where(t => t.DataTransacao >= inicio && t.DataTransacao <= fim);
        }
    }
}

