using api.Dtos;
using api.Exceptions;
using api.Mappers;
using api.Models;
using api.Repositories;

namespace api.Services;

public class VacinacaoService : IVacinacaoService
{
    private readonly IVacinacaoRepository _repository;
    private readonly IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto> _vacinacaoMapper;

    public VacinacaoService(
        IVacinacaoRepository repository,
        IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto> vacinacaoMapper)
    {
        _repository = repository;
        _vacinacaoMapper = vacinacaoMapper;
    }

    public Vacinacao Create(Vacinacao vacinacao)
    {
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
}