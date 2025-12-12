using api.Dto;

namespace api.Models;

public class Pessoa(int id, string nome)
{
    public int Id { get; set; } = id;
    public string Nome { get; set; } = nome;
}