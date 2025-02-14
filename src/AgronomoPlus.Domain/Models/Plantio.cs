namespace AgronomoPlus.Domain.Models;

public class Plantio
{
    public Guid Id{get;set;}
    public Guid PropriedadeId{get;set;}
    public string TipoSemente{get;set;}
    public string TipoSolo{get;set;}
    public string CorrecaoSolo{get;set;}
    public string Adubacao {get;set;}
    public int TempoCrecimento {get;set;}
    public DateTime? PrevisaoColheita{get;set;}
    public DateTime DataCriacao{get;set;}

    public Propriedade Propriedade{get;set;}
}
