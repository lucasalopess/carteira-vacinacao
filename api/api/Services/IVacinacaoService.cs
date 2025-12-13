using api.Models;

namespace api.Services;

public interface IVacinacaoService : IBaseService<Vacinacao>
{
    ICollection<Vacinacao> FindByPessoaId(int pessoaId);
    ICollection<Vacina> FindAtrasadasByPessoaId(int id);
}