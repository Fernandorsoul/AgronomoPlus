using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgronomoPlus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnaliseDeSoloController : ControllerBase
    {
        private readonly IAnaliseDeSoloService _analiseDeSoloService;

        public AnaliseDeSoloController(IAnaliseDeSoloService analiseDeSoloService)
        {
            _analiseDeSoloService = analiseDeSoloService ?? throw new ArgumentNullException(nameof(analiseDeSoloService));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComposicaoDeSolo>>> GetAll()
        {
            var analises = await _analiseDeSoloService.GetAllAsync();
            return Ok(analises);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ComposicaoDeSolo>> GetById(Guid id)
        {
            var analise = await _analiseDeSoloService.GetByIdAsync(id);
            if (analise == null)
                return NotFound("Análise não encontrada.");

            return Ok(analise);
        }

        [HttpPost]
        public async Task<ActionResult<ComposicaoDeSolo>> Create([FromBody] ComposicaoDeSolo analise)
        {
            if (analise == null)
                return BadRequest("Dados inválidos.");

            var createdAnalise = await _analiseDeSoloService.CreateAsync(analise);
            return CreatedAtAction(nameof(GetById), new { id = createdAnalise.Id }, createdAnalise);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ComposicaoDeSolo>> Update(Guid id, [FromBody] ComposicaoDeSolo analise)
        {
            if (analise == null)
                return BadRequest("Dados inválidos.");

            var updatedAnalise = await _analiseDeSoloService.UpdateAsync(id, analise);
            if (updatedAnalise == null)
                return NotFound("Análise não encontrada.");

            return Ok(updatedAnalise);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _analiseDeSoloService.DeleteAsync(id);
            if (!deleted)
                return NotFound("Análise não encontrada.");

            return NoContent();
        }
    }
}
