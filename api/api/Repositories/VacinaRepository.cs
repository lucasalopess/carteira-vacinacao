using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class VacinaRepository(AppDbContext context) : IVacinaRepository
{
    public void Add(Vacina vacina)
    {
        context.Vacina.Add(vacina);
        context.SaveChanges();
    }

    public Vacina? GetById(int id)
    {
        return context.Vacina.Find(id);
    }

    public IEnumerable<Vacina> GetAll()
    {
        return context.Vacina.AsNoTracking().ToList();
    }

    public void Remove(Vacina vacina)
    {
        context.Vacina.Remove(vacina);
        context.SaveChanges();
    }

    public void Update(Vacina existingVacina)
    {
        context.Vacina.Update(existingVacina);
        context.SaveChanges();
    }
}