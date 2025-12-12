namespace api.Models;

public class Vacina(string nome)
{
    public int Id { get; set; }
    public string Nome { get; set; } = nome;
}