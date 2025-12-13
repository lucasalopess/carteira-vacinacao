using api.Dtos;
using api.Mappers;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class VacinaController : ControllerBase
{
    private readonly IBaseMapper<Vacina, VacinaRequestDto, VacinaResponseDto> _vacinaMapper;
    private readonly IBaseService<Vacina> _vacinaService;

    public VacinaController(
        IBaseMapper<Vacina, VacinaRequestDto, VacinaResponseDto> vacinaMapper,
        IVacinaService vacinaService)
    {
        _vacinaMapper = vacinaMapper;
        _vacinaService = vacinaService;
    }

    [HttpPost(Name = "PostVacina")]
    public IActionResult Post([FromBody] VacinaRequestDto vacinaRequestDto)
    {
        return Ok(_vacinaMapper.ToDto(_vacinaService.Create(_vacinaMapper.FromDto(vacinaRequestDto))));
    }

    [HttpGet("{id}", Name = "GetVacinaById")]
    public IActionResult GetById(int id)
    {
        return Ok(_vacinaMapper.ToDto(_vacinaService.GetById(id)));
    }

    [HttpGet(Name = "GetAllVacinas")]
    public IActionResult GetAll()
    {
        return Ok(_vacinaService.GetAll()
            .Select(_vacinaMapper.ToDto));
    }

    [HttpPut("{id}", Name = "UpdateVacina")]
    public IActionResult Update(int id, [FromBody] VacinaRequestDto vacinaRequestDto)
    {
        return Ok(_vacinaMapper.ToDto(_vacinaService.Update(id, _vacinaMapper.FromDto(vacinaRequestDto))));
    }

    [HttpDelete("{id}", Name = "DeleteVacina")]
    public IActionResult Delete(int id)
    {
        _vacinaService.Delete(id);
        return NoContent();
    }
}