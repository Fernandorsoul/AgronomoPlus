using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Interfaces;
using AgronomoPlus.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AgronomoPlus.Application.Services;

/// <summary>
/// Serviço para movimentações financeiras.
/// Implementa lógica de negócio para operações com MovimentacaoFinanceira.
/// Corrigido: Serviço criado para resolver dependência não registrada no DI.
/// </summary>
public class MovimentacaoFinanceiraService : IMovimentacaoFinanceiraService
{
    private readonly IMovimentacaoFinanceiraRepository _movimentacaoRepository;

    public MovimentacaoFinanceiraService(IMovimentacaoFinanceiraRepository movimentacaoRepository)
    {
        _movimentacaoRepository = movimentacaoRepository ?? throw new ArgumentNullException(nameof(movimentacaoRepository));
    }

    public async Task<IEnumerable<MovimentacaoFinanceira>> GetAllAsync()
    {
        return await _movimentacaoRepository.GetAllAsync();
    }

    public async Task<MovimentacaoFinanceira?> GetByIdAsync(Guid id)
    {
        var movimentacao = await _movimentacaoRepository.GetByIdAsync(id);
        if (movimentacao == null)
            throw new KeyNotFoundException("Movimentação financeira não encontrada.");

        return movimentacao;
    }

    public async Task<MovimentacaoFinanceira> CreateAsync(MovimentacaoFinanceira movimentacao)
    {
        if (movimentacao == null)
            throw new ArgumentNullException(nameof(movimentacao));

        if (string.IsNullOrWhiteSpace(movimentacao.Descricao))
            throw new ArgumentException("Descrição é obrigatória.", nameof(movimentacao.Descricao));

        if (movimentacao.Valor <= 0)
            throw new ArgumentException("Valor deve ser maior que zero.", nameof(movimentacao.Valor));

        movimentacao.DataTransacao = DateTime.UtcNow;

        await _movimentacaoRepository.AddAsync(movimentacao);
        return movimentacao;
    }

    public async Task<MovimentacaoFinanceira?> UpdateAsync(Guid id, MovimentacaoFinanceira movimentacao)
    {
        if (movimentacao == null)
            throw new ArgumentNullException(nameof(movimentacao));

        var existente = await _movimentacaoRepository.GetByIdAsync(id);
        if (existente == null)
            throw new KeyNotFoundException("Movimentação financeira não encontrada.");

        // Atualiza os dados
        existente.TipoTransacao = movimentacao.TipoTransacao;
        existente.Descricao = movimentacao.Descricao;
        existente.Valor = movimentacao.Valor;
        existente.DataTransacao = movimentacao.DataTransacao;
        existente.UsuarioId = movimentacao.UsuarioId;

        _movimentacaoRepository.Update(existente);
        return existente;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var movimentacao = await _movimentacaoRepository.GetByIdAsync(id);
        if (movimentacao == null)
            throw new KeyNotFoundException("Movimentação financeira não encontrada.");

        _movimentacaoRepository.Delete(movimentacao);
        return true;
    }

    public async Task<IEnumerable<MovimentacaoFinanceira>> GetByUsuarioIdAsync(Guid usuarioId)
    {
        return await _movimentacaoRepository.GetByUsuarioIdAsync(usuarioId);
    }
}
