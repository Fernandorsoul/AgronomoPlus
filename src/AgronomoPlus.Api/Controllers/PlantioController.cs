using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgronomoPlus.Api.Controllers;

    [Route("api/[controller]")]
    [ApiController]

    public class PlantioController : ControllerBase
    {
        
        private readonly IPlantioService _plantioService;

        public PlantioController(IPlantioService plantioService)
        {
            _plantioService = plantioService ?? throw new ArgumentNullException(nameof(plantioService));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Plantio>>> GetAll()
        {
            var plantios = await _plantioService.GetAllAsync();
            return Ok(plantios);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetById(Guid id)
        {
            var culturas = await _plantioService.GetByIdAsync(id);
            if (culturas == null)
                return NotFound("A cultura não foi encontrado.");

            return Ok(culturas);
        }


        [HttpPost]
        public async Task<ActionResult<Plantio>> Create([FromBody] Plantio plantio)
        {
            if (plantio == null)
                return BadRequest("Dados inválidos.");

            var createdPlantio = await _plantioService.CreateAsync(plantio);
            return CreatedAtAction(nameof(GetById), new { id = createdPlantio.Id }, createdPlantio);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Plantio>> Update(Guid id, [FromBody] Plantio plantio)
        {
            if (plantio == null)
                return BadRequest("Dados inválidos.");

            var updatedPlantio = await _plantioService.UpdateAsync(id, plantio);
            if (updatedPlantio == null)
                return NotFound("Usuário não encontrado.");

            return Ok(updatedPlantio);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _plantioService.DeleteAsync(id);
            if (!deleted)
                return NotFound("Usuário não encontrado.");

            return NoContent();
        }
    }