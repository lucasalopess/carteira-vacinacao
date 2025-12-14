using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public record VacinaRequestDto(
    [Required(ErrorMessage = "O nome da vacina é obrigatório.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "O nome deve ter entre 1 e 100 caracteres.")]
    string? Nome,
    [Range(0, 100, ErrorMessage = "A idade inicial deve ser válida (0 ou maior).")]
    int? IdadeInicial,
    [Range(0, 100, ErrorMessage = "O intervalo deve ser um valor positivo.")]
    int? IntervaloDoses,
    [Required (ErrorMessage = "O campo recorrente é obrigatório.")]
    bool? Recorrente,
    int? QtdDoses,
    [Required(ErrorMessage = "O campo de doses de reforço é obrigatório.")]
    bool? DosesReforco,
    int? QtdReforco
);

public record VacinaResponseDto(
    int? Id,
    string? Nome,
    int? IdadeInicial,
    int? IntervaloDoses,
    bool? Recorrente,
    int? QtdDoses,
    bool? DosesReforco,
    int? QtdReforco
);