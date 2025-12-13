namespace api.Models;

public class Vacinacao()
{
    public Vacinacao(int pessoaId, int vacinaId, DateOnly dataVacinacao) : this()
    {
        PessoaId = pessoaId;
        VacinaId = vacinaId;
        DataVacinacao = dataVacinacao;
    }

    public int Id { get; set; }

    public int PessoaId { get; set; }
    public virtual Pessoa? Pessoa { get; set; }

    public int VacinaId { get; set; }
    public virtual Vacina? Vacina { get; set; }

    public DateOnly DataVacinacao { get; set; }
}