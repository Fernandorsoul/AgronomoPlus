using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Models;
using Microsoft.AspNetCore.Mvc;

// Arquivo corrigido: Controller atualizado para usar o serviço MovimentacaoFinanceiraService
// em vez de armazenamento estático em memória. Isso permite persistência no banco de dados
// e integração com o sistema de DI.
namespace AgronomoPlus.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinanceiroController : ControllerBase
    {
        private readonly IMovimentacaoFinanceiraService _movimentacaoService;

        public FinanceiroController(IMovimentacaoFinanceiraService movimentacaoService)
        {
            _movimentacaoService = movimentacaoService ?? throw new ArgumentNullException(nameof(movimentacaoService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var movimentacoes = await _movimentacaoService.GetAllAsync();
            return Ok(movimentacoes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var movimentacao = await _movimentacaoService.GetByIdAsync(id);
                return Ok(movimentacao);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Movimentação financeira não encontrada.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MovimentacaoFinanceira movimentacao)
        {
            if (movimentacao == null)
                return BadRequest("Dados inválidos.");

            try
            {
                var createdMovimentacao = await _movimentacaoService.CreateAsync(movimentacao);
                return CreatedAtAction(nameof(GetById), new { id = createdMovimentacao.Id }, createdMovimentacao);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] MovimentacaoFinanceira movimentacao)
        {
            if (movimentacao == null)
                return BadRequest("Dados inválidos.");

            try
            {
                var updatedMovimentacao = await _movimentacaoService.UpdateAsync(id, movimentacao);
                return Ok(updatedMovimentacao);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Movimentação financeira não encontrada.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var deleted = await _movimentacaoService.DeleteAsync(id);
                if (deleted)
                    return NoContent();
                else
                    return NotFound("Movimentação financeira não encontrada.");
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Movimentação financeira não encontrada.");
            }
        }
    }
}

