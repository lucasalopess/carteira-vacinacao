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

public class VacinaServiceTests
{
    private readonly Mock<IVacinaRepository> _repositoryMock;
    private readonly Mock<IBaseMapper<Vacina, VacinaRequestDto, VacinaResponseDto>> _mapperMock;
    private readonly VacinaService _service;

    public VacinaServiceTests()
    {
        _repositoryMock = new Mock<IVacinaRepository>();
        _mapperMock = new Mock<IBaseMapper<Vacina, VacinaRequestDto, VacinaResponseDto>>();
        _service = new VacinaService(_repositoryMock.Object, _mapperMock.Object);
    }

    #region Create Tests

    [Fact]
    public void Create_WithValidNonRecurrentVacina_ShouldAddAndReturn()
    {
        // Arrange
        var vacina = new Vacina("Hepatite B", 0, 1, false, 3, false, null) { Id = 1 };

        // Act
        var result = _service.Create(vacina);

        // Assert
        result.Should().BeSameAs(vacina);
        _repositoryMock.Verify(r => r.Add(vacina), Times.Once);
    }

    [Fact]
    public void Create_WithRecurrentVacina_ShouldAddAndReturn()
    {
        // Arrange
        var vacina = new Vacina("Gripe", 6, 12, true, null, false, null) { Id = 1 };

        // Act
        var result = _service.Create(vacina);

        // Assert
        result.Should().BeSameAs(vacina);
        _repositoryMock.Verify(r => r.Add(vacina), Times.Once);
    }

    [Fact]
    public void Create_WithNonRecurrentVacinaWithoutQtdDoses_ShouldThrowModelException()
    {
        // Arrange
        var vacina = new Vacina("Hepatite B", 0, 1, false, null, false, null);

        // Act
        var act = () => _service.Create(vacina);

        // Assert
        act.Should().Throw<ModelException>()
            .WithMessage("Vacinas não recorrentes devem ter quantidade de doses maior que zero.");
    }

    [Fact]
    public void Create_WithNonRecurrentVacinaWithZeroQtdDoses_ShouldThrowModelException()
    {
        // Arrange
        var vacina = new Vacina("Hepatite B", 0, 1, false, 0, false, null);

        // Act
        var act = () => _service.Create(vacina);

        // Assert
        act.Should().Throw<ModelException>()
            .WithMessage("Vacinas não recorrentes devem ter quantidade de doses maior que zero.");
    }

    [Fact]
    public void Create_WithDosesReforcoWithoutQtdReforco_ShouldThrowModelException()
    {
        // Arrange
        var vacina = new Vacina("Tétano", 0, 6, false, 3, true, null);

        // Act
        var act = () => _service.Create(vacina);

        // Assert
        act.Should().Throw<ModelException>()
            .WithMessage("Vacinas com doses de reforço devem ter quantidade de reforço maior que zero.");
    }

    [Fact]
    public void Create_WithDosesReforcoWithZeroQtdReforco_ShouldThrowModelException()
    {
        // Arrange
        var vacina = new Vacina("Tétano", 0, 6, false, 3, true, 0);

        // Act
        var act = () => _service.Create(vacina);

        // Assert
        act.Should().Throw<ModelException>()
            .WithMessage("Vacinas com doses de reforço devem ter quantidade de reforço maior que zero.");
    }

    [Fact]
    public void Create_WithValidVacinaWithReforco_ShouldAddAndReturn()
    {
        // Arrange
        var vacina = new Vacina("Tétano", 0, 6, false, 3, true, 2) { Id = 1 };

        // Act
        var result = _service.Create(vacina);

        // Assert
        result.Should().BeSameAs(vacina);
        _repositoryMock.Verify(r => r.Add(vacina), Times.Once);
    }

    #endregion

    #region Update Tests

    [Fact]
    public void Update_WhenVacinaExists_ShouldUpdateAndReturn()
    {
        // Arrange
        var existingVacina = new Vacina("Hepatite B", 0, 1, false, 3, false, null) { Id = 1 };
        var newVacina = new Vacina("Hepatite B v2", 0, 2, false, 3, false, null);
        var updatedVacina = new Vacina("Hepatite B v2", 0, 2, false, 3, false, null) { Id = 1 };

        _repositoryMock.Setup(r => r.GetById(1)).Returns(existingVacina);
        _mapperMock.Setup(m => m.CopyProperties(newVacina, existingVacina)).Returns(updatedVacina);

        // Act
        var result = _service.Update(1, newVacina);

        // Assert
        result.Should().BeSameAs(updatedVacina);
        _repositoryMock.Verify(r => r.Update(updatedVacina), Times.Once);
    }

    [Fact]
    public void Update_WhenVacinaDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var newVacina = new Vacina("Hepatite B v2", 0, 2, false, 3, false, null);
        _repositoryMock.Setup(r => r.GetById(999)).Returns((Vacina?)null);

        // Act
        var act = () => _service.Update(999, newVacina);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Vacina não encontrada com o id: {999}");
    }

    #endregion

    #region Delete Tests

    [Fact]
    public void Delete_WhenVacinaExists_ShouldRemove()
    {
        // Arrange
        var existingVacina = new Vacina("Hepatite B", 0, 1, false, 3, false, null) { Id = 1 };
        _repositoryMock.Setup(r => r.GetById(1)).Returns(existingVacina);

        // Act
        _service.Delete(1);

        // Assert
        _repositoryMock.Verify(r => r.Remove(existingVacina), Times.Once);
    }

    [Fact]
    public void Delete_WhenVacinaDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetById(999)).Returns((Vacina?)null);

        // Act
        var act = () => _service.Delete(999);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Vacina não encontrada com o id: {999}");
    }

    #endregion

    #region GetById Tests

    [Fact]
    public void GetById_WhenVacinaExists_ShouldReturn()
    {
        // Arrange
        var existingVacina = new Vacina("Hepatite B", 0, 1, false, 3, false, null) { Id = 1 };
        _repositoryMock.Setup(r => r.GetById(1)).Returns(existingVacina);

        // Act
        var result = _service.GetById(1);

        // Assert
        result.Should().BeSameAs(existingVacina);
    }

    [Fact]
    public void GetById_WhenVacinaDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetById(999)).Returns((Vacina?)null);

        // Act
        var act = () => _service.GetById(999);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Vacina não encontrada com o id: {999}");
    }

    #endregion

    #region GetAll Tests

    [Fact]
    public void GetAll_ShouldReturnAllVacinas()
    {
        // Arrange
        var vacinas = new List<Vacina>
        {
            new("Hepatite B", 0, 1, false, 3, false, null) { Id = 1 },
            new("Gripe", 6, 12, true, null, false, null) { Id = 2 }
        };
        _repositoryMock.Setup(r => r.GetAll()).Returns(vacinas);

        // Act
        var result = _service.GetAll();

        // Assert
        result.Should().BeEquivalentTo(vacinas);
    }

    #endregion
}