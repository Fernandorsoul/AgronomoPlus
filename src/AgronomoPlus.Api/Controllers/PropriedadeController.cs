using AgronomoPlus.Application.Services;
using AgronomoPlus.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgronomoPlus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropriedadeController : ControllerBase
    {
        private readonly PropriedadeService _propriedadeService;

        public PropriedadeController(PropriedadeService propriedadeService)
        {
            _propriedadeService = propriedadeService ?? throw new ArgumentNullException(nameof(propriedadeService));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Propriedade>>> GetAll()
        {
            var propriedades = await _propriedadeService.GetAllAsync();
            return Ok(propriedades);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Propriedade>> GetById(Guid id)
        {
            var propriedade = await _propriedadeService.GetByIdAsync(id);
            if (propriedade == null)
                return NotFound("Propriedade não encontrada.");

            return Ok(propriedade);
        }

        [HttpPost]
        public async Task<ActionResult<Propriedade>> Create([FromBody] Propriedade propriedade)
        {
            if (propriedade == null)
                return BadRequest("Dados inválidos.");

            var createdPropriedade = await _propriedadeService.CreateAsync(propriedade);
            return CreatedAtAction(nameof(GetById), new { id = createdPropriedade.Id }, createdPropriedade);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Propriedade>> Update(Guid id, [FromBody] Propriedade propriedade)
        {
            if (propriedade == null)
                return BadRequest("Dados inválidos.");

            var updatedPropriedade = await _propriedadeService.UpdateAsync(id, propriedade);
            if (updatedPropriedade == null)
                return NotFound("Propriedade não encontrada.");

            return Ok(updatedPropriedade);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _propriedadeService.DeleteAsync(id);
            if (!deleted)
                return NotFound("Propriedade não encontrada.");

            return NoContent();
        }
    }
}

