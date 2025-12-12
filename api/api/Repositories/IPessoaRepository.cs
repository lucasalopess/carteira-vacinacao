using api.Models;

namespace api.Repositories;

public interface IPessoaRepository
{
    void Add(Pessoa pessoa);
    Pessoa? GetById(int id);
    IEnumerable<Pessoa> GetAll();
    void Remove(Pessoa pessoa);
    void Update(Pessoa existingPessoa);
}
