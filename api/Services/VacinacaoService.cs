using api.Dtos;
using api.Exceptions;
using api.Mappers;
using api.Models;
using api.Repositories;

namespace api.Services;

public class VacinacaoService : IVacinacaoService
{
    private readonly IVacinacaoRepository _repository;
    private readonly IPessoaService _pessoaService;
    private readonly IVacinaService _vacinaService;
    private readonly IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto> _vacinacaoMapper;

    public VacinacaoService(
        IVacinacaoRepository repository,
        IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto> vacinacaoMapper, IPessoaService pessoaService,
        IVacinaService vacinaService)
    {
        _repository = repository;
        _vacinacaoMapper = vacinacaoMapper;
        _pessoaService = pessoaService;
        _vacinaService = vacinaService;
    }

    public Vacinacao Create(Vacinacao vacinacao)
    {
        ValidarNumeroDoses(vacinacao);
        ValidarPrazoProximaDose(vacinacao);

        _repository.Add(vacinacao);

        return vacinacao;
    }

    public Vacinacao Update(int id, Vacinacao newVacinacao)
    {
        var updatedVacinacao = _vacinacaoMapper.CopyProperties(newVacinacao, GetById(id));

        _repository.Update(updatedVacinacao);

        return updatedVacinacao;
    }

    public void Delete(int id)
    {
        _repository.Remove(GetById(id));
    }

    public Vacinacao GetById(int id)
    {
        var existingVacinacao = _repository.GetById(id);

        if (existingVacinacao == null) throw new NotFoundException($"Vacinação não encontrada com o id: {id}");

        return existingVacinacao;
    }

    public IEnumerable<Vacinacao> GetAll()
    {
        return _repository.GetAll();
    }

    public ICollection<Vacinacao> FindByPessoaId(int pessoaId)
    {
        return _repository.FindByPessoaId(pessoaId);
    }

    public ICollection<Vacina> FindAtrasadasByPessoaId(int id)
    {
        var pessoa = _pessoaService.GetById(id);
        var hoje = DateOnly.FromDateTime(DateTime.Now);

        var vacinacoesPorVacina = FindByPessoaId(id)
            .ToLookup(v => v.VacinaId);

        return _vacinaService.GetAll()
            //filtra as vacinas que a pessoa já pode tomar pela idade
            .Where(vacina => vacina.IdadeInicial <= pessoa.Idade)
            .Where(vacina =>
            {
                var totalNecessario = vacina.QntDoses + (vacina.DosesReforco ? vacina.QtdReforco : 0);
                
                var doses = vacinacoesPorVacina[vacina.Id]
                    .OrderBy(vacinacao => vacinacao.DataVacinacao)
                    .ToList(); //pega as doses já tomadas da vacina

                //se já tomou todas as doses necessárias, não está atrasado, retorna false e não entra na lista final
                if (doses.Count >= totalNecessario) return false;

                //se não nenhum dose está atrasado, retorna true e entra na lista final
                if (doses.Count == 0) return true;

                //se já tomou doses, verifica se a última dose já passou do intervalo para a próxima dose
                return hoje > doses.Last()
                    .DataVacinacao.AddMonths(vacina.IntervaloDoses);
            })
            .ToList();
    }

    private void ValidarNumeroDoses(Vacinacao vacinacao)
    {
        _pessoaService.GetById(vacinacao.PessoaId); //Verifica se a pessoa existe

        var vacina = _vacinaService.GetById(vacinacao.VacinaId);

        var vacinacaoList = FindByPessoaId(vacinacao.PessoaId);

        if ((!vacina.DosesReforco && vacinacaoList.Count >= vacina.QntDoses) || (vacina.DosesReforco &&
                vacinacaoList.Count >= vacina.QntDoses + vacina.QtdReforco))
        {
            throw new ModelException($"A vacina {vacina.Nome} só permite {vacina.QntDoses + vacina.QtdReforco} doses.");
        }
    }

    private void ValidarPrazoProximaDose(Vacinacao vacinacao)
    {
        _pessoaService.GetById(vacinacao.PessoaId); //Verifica se a pessoa existe

        var vacina = _vacinaService.GetById(vacinacao.VacinaId);

        var ultimaDose = FindByPessoaId(vacinacao.PessoaId)
            .Where(v => v.VacinaId == vacinacao.VacinaId)
            .OrderBy(v => v.DataVacinacao)
            .LastOrDefault();

        if (ultimaDose == null) return;

        var proximaData = ultimaDose.DataVacinacao.AddMonths(vacina.IntervaloDoses);

        if (vacinacao.DataVacinacao < proximaData)
        {
            throw new ModelException(
                $"A próxima dose da vacina {vacina.Nome} só pode ser aplicada a partir de {proximaData:dd/MM/yyyy}.");
        }
    }
}