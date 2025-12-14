namespace api.Models;

public class Vacina()
{
    public Vacina(string nome, int idadeInicial, int intervaloDoses, bool recorrente, int? qntDoses, bool dosesReforco,
        int? qtdReforco) : this()
    {
        Nome = nome;
        IdadeInicial = idadeInicial;
        IntervaloDoses = intervaloDoses;
        Recorrente = recorrente;
        QtdDoses = qntDoses;
        DosesReforco = dosesReforco;
        QtdReforco = qtdReforco;
    }

    public int Id { get; set; }
    public string Nome { get; set; }
    public int IdadeInicial { get; set; }
    public int IntervaloDoses { get; set; }
    public bool Recorrente { get; set; }
    public int? QtdDoses { get; set; }
    public bool DosesReforco { get; set; }
    public int? QtdReforco { get; set; }
}