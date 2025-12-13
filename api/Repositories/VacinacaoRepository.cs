using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class VacinacaoRepository(AppDbContext context) : IVacinacaoRepository
{
    public void Add(Vacinacao vacinacao)
    {
        context.Vacinacao.Add(vacinacao);
        context.SaveChanges();
    }

    public Vacinacao? GetById(int id)
    {
        return context.Vacinacao.Find(id);
    }

    public IEnumerable<Vacinacao> GetAll()
    {
        return context.Vacinacao.AsNoTracking().ToList();
    }

    public void Remove(Vacinacao vacinacao)
    {
        context.Vacinacao.Remove(vacinacao);
        context.SaveChanges();
    }

    public void Update(Vacinacao existingVacina)
    {
        context.Vacinacao.Update(existingVacina);
        context.SaveChanges();
    }

    public ICollection<Vacinacao> FindByPessoaId(int pessoaId)
    {
        return context.Vacinacao
            .Where(v => v.PessoaId == pessoaId)
            .AsNoTracking()
            .ToList();
    }

    public ICollection<Vacinacao> FindByPessoaIdAndVacinaId(int pessoaId, int vacinaId)
    {
        return context.Vacinacao
            .Where(v => v.PessoaId == pessoaId && v.VacinaId == vacinaId)
            .AsNoTracking()
            .ToList();
    }
}