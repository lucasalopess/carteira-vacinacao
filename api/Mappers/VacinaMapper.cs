using api.Dtos;
using api.Models;

namespace api.Mappers;

public class VacinaMapper : IBaseMapper<Vacina, VacinaRequestDto, VacinaResponseDto>
{
    public Vacina FromDto(VacinaRequestDto dto)
    {
        return new Vacina(
            dto.Nome!,
            dto.IdadeInicial!.Value,
            dto.IntervaloDoses!.Value,
            dto.QntDoses!.Value,
            dto.DosesReforco!.Value,
            dto.QtdReforco!.Value
        );
    }

    public VacinaResponseDto ToDto(Vacina entity)
    {
        return new VacinaResponseDto(
            entity.Id,
            entity.Nome,
            entity.IdadeInicial,
            entity.IntervaloDoses,
            entity.QntDoses,
            entity.DosesReforco,
            entity.QtdReforco
        );
    }

    public Vacina CopyProperties(Vacina source, Vacina target)
    {
        source.Nome = source.Nome;
        source.IdadeInicial = source.IdadeInicial;
        source.IntervaloDoses = source.IntervaloDoses;
        source.QntDoses = source.QntDoses;
        source.DosesReforco = source.DosesReforco;
        source.QtdReforco = source.QtdReforco;

        return target;
    }

    public ICollection<VacinaResponseDto> ToDto(ICollection<Vacina> entities)
    {
        return entities.Select(ToDto).ToList();
    }
}