using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.Dtos;

public record PessoaRequestDto(
    [Required(ErrorMessage = "Nome é um campo obrigatório")]
    [StringLength(100, MinimumLength = 3)]
    string? Nome,
    [Required(ErrorMessage = "Idade é um campo obrigatório")]
    [Range(0, 120, ErrorMessage = "Idade inválida")]
    int? Idade,
    [Required(ErrorMessage = "Sexo é um campo obrigatório")]
    SexoEnum? Sexo);

public record PessoaResponseDto(int? Id, string? Nome, int? Idade, SexoEnum? Sexo);