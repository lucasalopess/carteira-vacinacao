using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Pessoa> Pessoa { get; set; }
    public DbSet<Vacina> Vacina { get; set; }
    public DbSet<Vacinacao> Vacinacao { get; set; }
}