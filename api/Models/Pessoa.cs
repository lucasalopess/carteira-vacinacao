namespace api.Models;

public class Pessoa()
{
    public Pessoa(string nome, int idade, SexoEnum sexo) : this()
    {
        Nome = nome;
        Idade = idade;
        Sexo = sexo;
    }

    public int Id { get; set; }
    public string Nome { get; set; }
    public int Idade { get; set; }
    public SexoEnum Sexo { get; set; }
}