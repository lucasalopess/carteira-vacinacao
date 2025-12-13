using api.Data;
using api.Dtos;
using api.Mappers;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class PessoaController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IBaseMapper<Pessoa, PessoaRequestDto, PessoaResponseDto> _pessoaMapper;
    private readonly IPessoaService _pessoaService;

    public PessoaController(
        IBaseMapper<Pessoa, PessoaRequestDto, PessoaResponseDto> pessoaMapper,
        IPessoaService pessoaService,
        AppDbContext context)
    {
        _pessoaMapper = pessoaMapper;
        _pessoaService = pessoaService;
        _context = context;
    }

    [HttpPost(Name = "PostPessoa")]
    public IActionResult Post([FromBody] PessoaRequestDto pessoaRequestDto)
    {
        return Ok(_pessoaMapper.ToDto(_pessoaService.Create(_pessoaMapper.FromDto(pessoaRequestDto))));
    }

    [HttpGet("{id}", Name = "GetPessoaById")]
    public IActionResult GetById(int id)
    {
        return Ok(_pessoaMapper.ToDto(_pessoaService.GetById(id)));
    }

    [HttpGet(Name = "GetAllPessoas")]
    public IActionResult GetAll()
    {
        return Ok(_pessoaService.GetAll()
            .Select(_pessoaMapper.ToDto));
    }

    [HttpPut("{id}", Name = "UpdatePessoa")]
    public IActionResult Update(int id, [FromBody] PessoaRequestDto pessoaRequestDto)
    {
        return Ok(_pessoaMapper.ToDto(_pessoaService.Update(id, _pessoaMapper.FromDto(pessoaRequestDto))));
    }

    [HttpDelete("{id}", Name = "DeletePessoa")]
    public IActionResult Delete(int id)
    {
        _pessoaService.Delete(id);
        return NoContent();
    }

    [HttpGet("sexo", Name = "GetAllSexoEnum")]
    public IActionResult GetAllSexoEnum()
    {
        var sexoValues = Enum.GetValues<SexoEnum>();
        return Ok(sexoValues);
    }
}