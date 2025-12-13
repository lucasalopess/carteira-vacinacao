using api.Dtos;
using api.Models;

namespace api.Mappers;

public class VacinacaoMapper : IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto>
{
    public VacinacaoResponseDto ToDto(Vacinacao entity)
    {
        return new VacinacaoResponseDto(
            entity.Id,
            entity.PessoaId,
            entity.VacinaId,
            entity.DataVacinacao
        );
    }

    public Vacinacao CopyProperties(Vacinacao source, Vacinacao target)
    {
        target.Pessoa = source.Pessoa;
        target.Vacina = source.Vacina;
        target.DataVacinacao = source.DataVacinacao;

        return target;
    }

    public ICollection<VacinacaoResponseDto> ToDto(ICollection<Vacinacao> entities)
    {
        return entities.Select(ToDto).ToList();
    }

    public Vacinacao FromDto(VacinacaoRequestDto dto)
    {
        return new Vacinacao(
            dto.PessoaId!.Value,
            dto.VacinaId!.Value,
            dto.DataVacinacao!.Value
        );
    }
}