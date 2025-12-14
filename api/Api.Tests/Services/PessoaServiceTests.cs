using api.Dtos;
using api.Exceptions;
using api.Mappers;
using api.Models;
using api.Repositories;
using api.Services;
using FluentAssertions;
using Moq;
using Xunit;

namespace Api.Tests.Services;

public class PessoaServiceTests
{
    private readonly Mock<IPessoaRepository> _repositoryMock;
    private readonly Mock<IBaseMapper<Pessoa, PessoaRequestDto, PessoaResponseDto>> _mapperMock;
    private readonly PessoaService _service;

    public PessoaServiceTests()
    {
        _repositoryMock = new Mock<IPessoaRepository>();
        _mapperMock = new Mock<IBaseMapper<Pessoa, PessoaRequestDto, PessoaResponseDto>>();
        _service = new PessoaService(_repositoryMock.Object, _mapperMock.Object);
    }

    #region Create Tests

    [Fact]
    public void Create_WithValidPessoa_ShouldAddAndReturn()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino);

        // Act
        var result = _service.Create(pessoa);

        // Assert
        result.Should().BeSameAs(pessoa);
        _repositoryMock.Verify(r => r.Add(pessoa), Times.Once);
    }

    #endregion

    #region Update Tests

    [Fact]
    public void Update_WhenPessoaExists_ShouldUpdateAndReturn()
    {
        // Arrange
        var existingPessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var newPessoa = new Pessoa("João Santos", 31, SexoEnum.Masculino);
        var updatedPessoa = new Pessoa("João Santos", 31, SexoEnum.Masculino) { Id = 1 };

        _repositoryMock.Setup(r => r.GetById(1)).Returns(existingPessoa);
        _mapperMock.Setup(m => m.CopyProperties(newPessoa, existingPessoa)).Returns(updatedPessoa);

        // Act
        var result = _service.Update(1, newPessoa);

        // Assert
        result.Should().BeSameAs(updatedPessoa);
        _repositoryMock.Verify(r => r.Update(updatedPessoa), Times.Once);
    }

    [Fact]
    public void Update_WhenPessoaDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var newPessoa = new Pessoa("João Santos", 31, SexoEnum.Masculino);
        _repositoryMock.Setup(r => r.GetById(999)).Returns((Pessoa?)null);

        // Act
        var act = () => _service.Update(999, newPessoa);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Pessoa não encontrada com o id: {999}");
    }

    #endregion

    #region Delete Tests

    [Fact]
    public void Delete_WhenPessoaExists_ShouldRemove()
    {
        // Arrange
        var existingPessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        _repositoryMock.Setup(r => r.GetById(1)).Returns(existingPessoa);

        // Act
        _service.Delete(1);

        // Assert
        _repositoryMock.Verify(r => r.Remove(existingPessoa), Times.Once);
    }

    [Fact]
    public void Delete_WhenPessoaDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetById(999)).Returns((Pessoa?)null);

        // Act
        var act = () => _service.Delete(999);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Pessoa não encontrada com o id: {999}");
    }

    #endregion

    #region GetById Tests

    [Fact]
    public void GetById_WhenPessoaExists_ShouldReturn()
    {
        // Arrange
        var existingPessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        _repositoryMock.Setup(r => r.GetById(1)).Returns(existingPessoa);

        // Act
        var result = _service.GetById(1);

        // Assert
        result.Should().BeSameAs(existingPessoa);
    }

    [Fact]
    public void GetById_WhenPessoaDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetById(999)).Returns((Pessoa?)null);

        // Act
        var act = () => _service.GetById(999);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Pessoa não encontrada com o id: {999}");
    }

    #endregion

    #region GetAll Tests

    [Fact]
    public void GetAll_ShouldReturnAllPessoas()
    {
        // Arrange
        var pessoas = new List<Pessoa>
        {
            new("João Silva", 30, SexoEnum.Masculino) { Id = 1 },
            new("Maria Santos", 25, SexoEnum.Feminino) { Id = 2 }
        };
        _repositoryMock.Setup(r => r.GetAll()).Returns(pessoas);

        // Act
        var result = _service.GetAll();

        // Assert
        result.Should().BeEquivalentTo(pessoas);
    }

    #endregion
}