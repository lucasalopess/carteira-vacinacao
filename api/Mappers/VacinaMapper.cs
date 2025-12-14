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
            dto.QtdDoses!.Value,
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
            entity.QtdDoses,
            entity.DosesReforco,
            entity.QtdReforco
        );
    }

    public Vacina CopyProperties(Vacina source, Vacina target)
    {
        target.Nome = source.Nome;
        target.IdadeInicial = source.IdadeInicial;
        target.IntervaloDoses = source.IntervaloDoses;
        target.QtdDoses = source.QtdDoses;
        target.DosesReforco = source.DosesReforco;
        target.QtdReforco = source.QtdReforco;

        return target;
    }

    public ICollection<VacinaResponseDto> ToDto(ICollection<Vacina> entities)
    {
        return entities.Select(ToDto).ToList();
    }
}