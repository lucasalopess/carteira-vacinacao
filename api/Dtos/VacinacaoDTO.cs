using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public record VacinacaoRequestDto(
    [Required(ErrorMessage = "O campo pessoa é obrigatório.")]
    int? PessoaId,
    [Required(ErrorMessage = "O campo vacina é obrigatório.")]
    int? VacinaId,
    [Required(ErrorMessage = "A data de vacinação é obrigatória.")]
    DateOnly? DataVacinacao
);

public record VacinacaoResponseDto(
    int? Id,
    int? PessoaId,
    int? VacinaId,
    DateOnly? DataVacinacao
);