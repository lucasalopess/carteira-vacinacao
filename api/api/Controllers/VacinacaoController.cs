using api.Dtos;
using api.Mappers;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class VacinacaoController : ControllerBase
{
    private readonly IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto> _vacinacaoMapper;
    private readonly IVacinacaoService _vacinacaoService;

    public VacinacaoController(
        IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto> vacinacaoMapper,
        IVacinacaoService vacinacaoService)
    {
        _vacinacaoMapper = vacinacaoMapper;
        _vacinacaoService = vacinacaoService;
    }

    [HttpPost(Name = "PostVacinacao")]
    public IActionResult Post([FromBody] VacinacaoRequestDto vacinacaoRequestDto)
    {
        return Ok(_vacinacaoMapper.ToDto(_vacinacaoService.Create(_vacinacaoMapper.FromDto(vacinacaoRequestDto))));
    }

    [HttpGet("{id}", Name = "GetVacinacaoById")]
    public IActionResult GetById(int id)
    {
        return Ok(_vacinacaoMapper.ToDto(_vacinacaoService.GetById(id)));
    }

    [HttpGet(Name = "GetAllVacinacaos")]
    public IActionResult GetAll()
    {
        return Ok(_vacinacaoService.GetAll()
            .Select(_vacinacaoMapper.ToDto));
    }

    [HttpPut("{id}", Name = "UpdateVacinacao")]
    public IActionResult Update(int id, [FromBody] VacinacaoRequestDto vacinacaoRequestDto)
    {
        return Ok(_vacinacaoMapper.ToDto(_vacinacaoService.Update(id, _vacinacaoMapper.FromDto(vacinacaoRequestDto))));
    }

    [HttpDelete("{id}", Name = "DeleteVacinacao")]
    public IActionResult Delete(int id)
    {
        _vacinacaoService.Delete(id);
        return NoContent();
    }

    [HttpGet("pessoa/{id}", Name = "GetVacinacoesByPessoaId")]
    public IActionResult GetVacinacoesByPessoaId(int id)
    {
        var vacinacoes = _vacinacaoService.FindByPessoaId(id);

        var resultadoAgrupado = vacinacoes
            .GroupBy(v => v.VacinaId)
            .Select(grupo => new
            {
                VacinaId = grupo.Key,
                QuantidadeDoses = grupo.Count(),
                Historico = grupo.Select(v => v.DataVacinacao).ToList()
            });

        return Ok(resultadoAgrupado);
    }
}