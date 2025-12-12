using api.Dto;
using api.Models;

namespace api.Mappers;

public static class PessoaMapper
{
    public static Pessoa FromDto(PessoaRequestDto dto)
        => new Pessoa(dto.Id, dto.Nome);

    public static PessoaResponseDto ToDto(Pessoa entity)
        => new PessoaResponseDto(entity.Id, entity.Nome);
}