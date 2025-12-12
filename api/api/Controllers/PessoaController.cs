using api.Dto;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Repositories;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class PessoaController(IPessoaRepository pessoaRepository) : ControllerBase
{
    [HttpPost(Name = "PostPessoa")]
    public IActionResult Post([FromBody] PessoaRequestDto pessoaRequestDto)
    {
        Pessoa pessoa = PessoaMapper.FromDto(pessoaRequestDto);

        pessoaRepository.Add(pessoa);

        return Ok(PessoaMapper.ToDto(pessoa));
    }

    [HttpGet("{id}", Name = "GetPessoaById")]
    public IActionResult GetById(int id)
    {
        Pessoa? pessoa = pessoaRepository.GetById(id);

        return pessoa != null ? Ok(PessoaMapper.ToDto(pessoa)) : NotFound();
    }

    [HttpGet(Name = "GetAllPessoas")]
    public IActionResult GetAll()
    {
        return Ok(pessoaRepository.GetAll()
            .Select(p => PessoaMapper.ToDto(p)));
    }
    
    [HttpPut("{id}", Name = "UpdatePessoa")]
    public IActionResult Update(int id, [FromBody] PessoaRequestDto pessoaRequestDto)
    {
        Pessoa? existingPessoa = pessoaRepository.GetById(id);
        if (existingPessoa == null)
        {
            return NotFound();
        }

        existingPessoa.Nome = pessoaRequestDto.Nome;
        pessoaRepository.Update(existingPessoa);

        return Ok(PessoaMapper.ToDto(existingPessoa));
    }

    [HttpDelete("{id}", Name = "DeletePessoa")]
    public IActionResult Delete(int id)
    {
        Pessoa? existingPessoa = pessoaRepository.GetById(id);
        if (existingPessoa == null)
        {
            return NotFound();
        }

        pessoaRepository.Remove(existingPessoa);
        return NoContent();
    }
}