namespace AgronomoPlus.Domain.Models;

public class Propriedade
{
    public Guid Id {get;set;}
    public Guid PersonId{get;set;}
    public string Nome{get;set;}
    public string Localizacao{get;set;}
    public decimal TamanhoArea{get;set;}
    public DateTime DataCriacao{get;set;}

    public Person Person {get;set;}
}
