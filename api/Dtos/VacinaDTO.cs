using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public record VacinaRequestDto(
    [Required(ErrorMessage = "O nome da vacina é obrigatório.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve ter entre 3 e 100 caracteres.")]
    string? Nome,
    [Range(0, 100, ErrorMessage = "A idade inicial deve ser válida (0 ou maior).")]
    int? IdadeInicial,
    [Range(0, 100, ErrorMessage = "O intervalo deve ser um valor positivo.")]
    int? IntervaloDoses,
    [Range(1, 10, ErrorMessage = "A quantidade de doses deve ser entre 1 e 10.")]
    int? QtdDoses,
    [Required(ErrorMessage = "O campo de doses de reforço é obrigatório.")]
    bool? DosesReforco,
    [Range(0, 10, ErrorMessage = "A quantidade de reforço deve ser entre 0 e 10.")]
    int? QtdReforco
);

public record VacinaResponseDto(
    int? Id,
    string? Nome,
    int? IdadeInicial,
    int? IntervaloDoses,
    int? QtdDoses,
    bool? DosesReforco,
    int? QtdReforco
);