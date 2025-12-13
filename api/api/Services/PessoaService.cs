using api.Dtos;
using api.Exceptions;
using api.Mappers;
using api.Models;
using api.Repositories;

namespace api.Services;

public class PessoaService : IPessoaService
{
    private readonly IBaseMapper<Pessoa, PessoaRequestDto, PessoaResponseDto> _pessoaMapper;
    private readonly IPessoaRepository _repository;

    public PessoaService(
        IPessoaRepository repository,
        IBaseMapper<Pessoa, PessoaRequestDto, PessoaResponseDto> pessoaMapper)
    {
        _repository = repository;
        _pessoaMapper = pessoaMapper;
    }

    public Pessoa Create(Pessoa pessoa)
    {
        _repository.Add(pessoa);

        return pessoa;
    }

    public Pessoa Update(int id, Pessoa newPessoa)
    {
        var updatedPessoa = _pessoaMapper.CopyProperties(newPessoa, GetById(id));

        _repository.Update(updatedPessoa);

        return updatedPessoa;
    }

    public void Delete(int id)
    {
        _repository.Remove(GetById(id));
    }

    public Pessoa GetById(int id)
    {
        var existingPessoa = _repository.GetById(id);

        if (existingPessoa == null) throw new NotFoundException($"Pessoa não encontrada com o id: {id}");

        return existingPessoa;
    }

    public IEnumerable<Pessoa> GetAll()
    {
        return _repository.GetAll();
    }
}