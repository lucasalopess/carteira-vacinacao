using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class PessoaRepository(AppDbContext context) : IPessoaRepository
{
    public void Add(Pessoa pessoa)
    {
        context.Pessoas.Add(pessoa);
        context.SaveChanges();
    }

    public Pessoa? GetById(int id)
    {
        return context.Pessoas.Find(id);
    }

    public IEnumerable<Pessoa> GetAll()
    {
        return context.Pessoas.AsNoTracking().ToList();
    }

    public void Remove(Pessoa pessoa)
    {
        context.Pessoas.Remove(pessoa);
        context.SaveChanges();
    }

    public void Update(Pessoa existingPessoa)
    {
        context.Pessoas.Update(existingPessoa);
        context.SaveChanges();
    }
}