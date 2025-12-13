using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class PessoaRepository(AppDbContext context) : IPessoaRepository
{
    public Pessoa? GetById(int id)
    {
        return context.Pessoa.Find(id);
    }

    public IEnumerable<Pessoa> GetAll()
    {
        return context.Pessoa.AsNoTracking().ToList();
    }

    public void Remove(Pessoa pessoa)
    {
        context.Pessoa.Remove(pessoa);
        context.SaveChanges();
    }

    public void Update(Pessoa existingPessoa)
    {
        context.Pessoa.Update(existingPessoa);
        context.SaveChanges();
    }

    public void Add(Pessoa pessoa)
    {
        context.Pessoa.Add(pessoa);
        context.SaveChanges();
    }
}