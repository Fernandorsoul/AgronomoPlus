using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class FinanceiroController : ControllerBase
{
    private static List<object> movimentacoes = new List<object>();

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(movimentacoes);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        if (id < 0 || id >= movimentacoes.Count)
            return NotFound("Movimentação não encontrada.");

        return Ok(movimentacoes[id]);
    }

    [HttpPost]
    public IActionResult Create([FromBody] object movimentacao)
    {
        movimentacoes.Add(movimentacao);
        return Created($"api/financeiro/{movimentacoes.Count - 1}", movimentacao);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] object movimentacaoAtualizada)
    {
        if (id < 0 || id >= movimentacoes.Count)
            return NotFound("Movimentação não encontrada.");

        movimentacoes[id] = movimentacaoAtualizada;
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        if (id < 0 || id >= movimentacoes.Count)
            return NotFound("Movimentação não encontrada.");

        movimentacoes.RemoveAt(id);
        return NoContent();
    }
}

