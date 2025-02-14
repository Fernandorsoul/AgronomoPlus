using AgronomoPlus.Application.Interfaces;
using AgronomoPlus.Application.Services;
using AgronomoPlus.Domain.Models;
using Microsoft.AspNetCore.Mvc;


namespace AgronomoPlus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly IPersonService _personService;

        public PersonController(IPersonService personService)
        {
            _personService = personService ?? throw new ArgumentNullException(nameof(personService));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetAll()
        {
            var pessoas = await _personService.GetAllAsync();
            return Ok(pessoas);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetById(Guid id)
        {
            var person = await _personService.GetByIdAsync(id);
            if (person == null)
                return NotFound("Usuário não encontrado.");

            return Ok(person);
        }


        [HttpPost]
        public async Task<ActionResult<Person>> Create([FromBody] Person person)
        {
            if (person == null)
                return BadRequest("Dados inválidos.");

            var createdPerson = await _personService.CreateAsync(person);
            return CreatedAtAction(nameof(GetById), new { id = createdPerson.Id }, createdPerson);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Person>> Update(Guid id, [FromBody] Person person)
        {
            if (person == null)
                return BadRequest("Dados inválidos.");

            var updatedPerson = await _personService.UpdateAsync(id, person);
            if (updatedPerson == null)
                return NotFound("Usuário não encontrado.");

            return Ok(updatedPerson);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _personService.DeleteAsync(id);
            if (!deleted)
                return NotFound("Usuário não encontrado.");

            return NoContent();
        }
    }
}
