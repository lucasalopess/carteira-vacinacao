using api.Models;

namespace api.Repositories;

public interface IVacinacaoRepository : IBaseRepository<Vacinacao>
{
    ICollection<Vacinacao> FindByPessoaId(int pessoaId);
    ICollection<Vacinacao> FindByPessoaIdAndVacinaId(int pessoaId, int vacinaId);
}