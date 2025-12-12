namespace api.Models;

public class Vacinacao(int id, Pessoa pessoa, Vacina vacina, DateTime dataVacinacao)
{
    public int Id { get; set; } = id;
    public Pessoa Pessoa { get; set; } = pessoa;
    public Vacina Vacina { get; set; } = vacina;
    public DateTime DataVacinacao { get; set; } = dataVacinacao;
}