namespace AgronomoPlus.Domain.Models;

public class Person
{
    public Guid Id {get;set;}
    public string Nome{get;set;}
    public string Email{get;set;}
    public string Password{get;set;}
    public DateTime DataCriacao{get;set;}
    public DateTime? UltimoAcesso{get;set;}
    public bool Ativo{get;set;}

}
