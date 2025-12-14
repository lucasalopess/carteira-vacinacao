using api.Dtos;
using api.Exceptions;
using api.Mappers;
using api.Models;
using api.Repositories;

namespace api.Services;

public class VacinaService : IVacinaService
{
    private readonly IVacinaRepository _repository;
    private readonly IBaseMapper<Vacina, VacinaRequestDto, VacinaResponseDto> _vacinaMapper;

    public VacinaService(
        IVacinaRepository repository,
        IBaseMapper<Vacina, VacinaRequestDto, VacinaResponseDto> vacinaMapper)
    {
        _repository = repository;
        _vacinaMapper = vacinaMapper;
    }
    
    private void ValidarRecorrencia(Vacina vacina)
    {
        if (!vacina.Recorrente && (vacina.QtdDoses == null || vacina.QtdDoses <= 0))
        {
            throw new ModelException("Vacinas não recorrentes devem ter quantidade de doses maior que zero.");
        }

        if (vacina.DosesReforco && (vacina.QtdReforco == null || vacina.QtdReforco <= 0))
        {
            throw new ModelException("Vacinas com doses de reforço devem ter quantidade de reforço maior que zero.");
        }
    }

    public Vacina Create(Vacina vacina)
    {
        ValidarRecorrencia(vacina);
        
        _repository.Add(vacina);

        return vacina;
    }

    public Vacina Update(int id, Vacina newVacina)
    {
        var updatedVacina = _vacinaMapper.CopyProperties(newVacina, GetById(id));
 
        _repository.Update(updatedVacina);

        return updatedVacina;
    }

    public void Delete(int id)
    {
        _repository.Remove(GetById(id));
    }

    public Vacina GetById(int id)
    {
        var existingVacina = _repository.GetById(id);

        if (existingVacina == null) throw new NotFoundException($"Vacina não encontrada com o id: {id}");

        return existingVacina;
    }

    public IEnumerable<Vacina> GetAll()
    {
        return _repository.GetAll();
    }
}