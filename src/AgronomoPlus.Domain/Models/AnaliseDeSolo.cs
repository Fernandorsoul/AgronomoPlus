namespace AgronomoPlus.Domain.Models;

public class AnaliseDeSolo
{
    public Guid Id { get; set; } = Guid.NewGuid();  // Usando UUID
        public Guid PropriedadeId { get; set; }  // Relacionamento com a propriedade
        public DateTime DataAnalise { get; set; } = DateTime.UtcNow;
        public decimal PH { get; set; }  // Medida de acidez/alcalinidade do solo
        public decimal MateriaOrganica { get; set; }  // Teor de matéria orgânica
        public decimal Nitrogenio { get; set; }
        public decimal Fosforo { get; set; }
        public decimal Potassio { get; set; }
        public decimal Calcio { get; set; }
        public decimal Magnesio { get; set; }
        public decimal Enxofre { get; set; }
        public decimal Aluminio { get; set; }
        public string Recomendacoes { get; set; }  // Texto com sugestões de correção

        // Propriedade de Navegação
        public virtual Propriedade Propriedade { get; set; }
}
