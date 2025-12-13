using api.Dtos;
using api.Models;

namespace api.Mappers;

public class PessoaMapper : IBaseMapper<Pessoa, PessoaRequestDto, PessoaResponseDto>
{
    public Pessoa FromDto(PessoaRequestDto dto)
    {
        return new Pessoa(
            dto.Nome!,
            dto.Idade!.Value,
            dto.Sexo!.Value
        );
    }

    public PessoaResponseDto ToDto(Pessoa entity)
    {
        return new PessoaResponseDto(entity.Id, entity.Nome, entity.Idade, entity.Sexo);
    }

    public Pessoa CopyProperties(Pessoa source, Pessoa target)
    {
        target.Nome = source.Nome;
        target.Idade = source.Idade;
        target.Sexo = source.Sexo;
        return target;
    }

    public ICollection<PessoaResponseDto> ToDto(ICollection<Pessoa> entities)
    {
        return entities.Select(ToDto).ToList();
    }
}