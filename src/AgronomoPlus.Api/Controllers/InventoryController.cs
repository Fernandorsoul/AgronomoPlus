using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace AgronomoPlus.Api.Controllers
{
    public class InventoryItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; } // insumos, equipamentos, medicamentos, combustivel, outros
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public string PurchaseDate { get; set; }
        public string? ExpiryDate { get; set; }
        public string? LastMaintenance { get; set; }
        public string? NextMaintenance { get; set; }
        public string Supplier { get; set; }
        public decimal Cost { get; set; }
        public string Location { get; set; }
        public string Status { get; set; } // disponivel, baixo_estoque, vencido, manutencao
        public int MinQuantity { get; set; }
        public string? Barcode { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        // GET: api/inventory
        [HttpGet]
        public IActionResult GetInventoryItems([FromQuery] string? category = null)
        {
            // No hardcoded items, return empty list until items are inserted
            return Ok(new List<InventoryItem>());
        }

        // POST: api/inventory
        [HttpPost]
        public IActionResult CreateInventoryItem([FromBody] InventoryItem item)
        {
            if (item == null || string.IsNullOrEmpty(item.Name))
            {
                return BadRequest("Item inválido");
            }

            // For now, just return the item with a generated ID
            // In a real implementation, save to database
            item.Id = new System.Random().Next(1000, 9999);
            return CreatedAtAction(nameof(GetInventoryItems), new { id = item.Id }, item);
        }
    }
}
