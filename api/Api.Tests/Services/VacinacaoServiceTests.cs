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

public class VacinacaoServiceTests
{
    private readonly Mock<IVacinacaoRepository> _repositoryMock;
    private readonly Mock<IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto>> _mapperMock;
    private readonly Mock<IPessoaService> _pessoaServiceMock;
    private readonly Mock<IVacinaService> _vacinaServiceMock;
    private readonly VacinacaoService _service;

    public VacinacaoServiceTests()
    {
        _repositoryMock = new Mock<IVacinacaoRepository>();
        _mapperMock = new Mock<IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto>>();
        _pessoaServiceMock = new Mock<IPessoaService>();
        _vacinaServiceMock = new Mock<IVacinaService>();
        _service = new VacinacaoService(
            _repositoryMock.Object,
            _mapperMock.Object,
            _pessoaServiceMock.Object,
            _vacinaServiceMock.Object);
    }

    #region Create Tests

    [Fact]
    public void Create_WithValidFirstDose_ShouldAddAndReturn()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var vacina = new Vacina("Hepatite B", 0, 1, false, 3, false, null) { Id = 1 };
        var vacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now)) { Id = 1 };

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _vacinaServiceMock.Setup(s => s.GetById(1)).Returns(vacina);
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(new List<Vacinacao>());

        // Act
        var result = _service.Create(vacinacao);

        // Assert
        result.Should().BeSameAs(vacinacao);
        _repositoryMock.Verify(r => r.Add(vacinacao), Times.Once);
    }

    [Fact]
    public void Create_WhenExceedsMaxDoses_ShouldThrowModelException()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var vacina = new Vacina("Hepatite B", 0, 1, false, 2, false, null) { Id = 1 };
        var existingVacinacoes = new List<Vacinacao>
        {
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-3))) { Id = 1 },
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-2))) { Id = 2 }
        };
        var newVacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now));

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _vacinaServiceMock.Setup(s => s.GetById(1)).Returns(vacina);
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(existingVacinacoes);

        // Act
        var act = () => _service.Create(newVacinacao);

        // Assert
        act.Should().Throw<ModelException>()
            .WithMessage($"A vacina {vacina.Nome} só permite {vacina.QtdDoses + vacina.QtdReforco} doses.");
    }

    [Fact]
    public void Create_WhenWithinMinimumInterval_ShouldThrowModelException()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var vacina = new Vacina("Hepatite B", 0, 1, false, 3, false, null) { Id = 1 };
        var existingVacinacoes = new List<Vacinacao>
        {
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddDays(-15))) { Id = 1 },
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddDays(-10))) { Id = 2 },
        };
        var newVacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now));

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _vacinaServiceMock.Setup(s => s.GetById(1)).Returns(vacina);
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(existingVacinacoes);

        // Act
        var act = () => _service.Create(newVacinacao);

        // Assert
        act.Should().Throw<ModelException>()
            .WithMessage(
                $"A próxima dose da vacina {vacina.Nome} só pode ser aplicada a partir de {
                    existingVacinacoes.OrderBy(v => v.DataVacinacao)
                        .Last().DataVacinacao.AddMonths(vacina.IntervaloDoses):dd/MM/yyyy}.");
    }

    [Fact]
    public void Create_WhenPessoaDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var vacinacao = new Vacinacao(999, 1, DateOnly.FromDateTime(DateTime.Now));
        _pessoaServiceMock.Setup(s => s.GetById(999))
            .Throws(new NotFoundException($"Pessoa não encontrada com o id: {999}"));

        // Act
        var act = () => _service.Create(vacinacao);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Pessoa não encontrada com o id: {999}");
    }

    [Fact]
    public void Create_WhenVacinaDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var vacinacao = new Vacinacao(1, 999, DateOnly.FromDateTime(DateTime.Now));

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _vacinaServiceMock.Setup(s => s.GetById(999))
            .Throws(new NotFoundException($"Vacina não encontrada com o id: {999}"));
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(new List<Vacinacao>());

        // Act
        var act = () => _service.Create(vacinacao);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Vacina não encontrada com o id: {999}");
    }

    [Fact]
    public void Create_WithVacinaWithReforco_ShouldAllowAllDosesAndReforcos()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var vacina = new Vacina("Tétano", 0, 6, false, 3, true, 2) { Id = 1 };
        var existingVacinacoes = new List<Vacinacao>
        {
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-36))) { Id = 1 },
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-30))) { Id = 2 },
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-24))) { Id = 3 },
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-18))) { Id = 4 }
        };
        var newVacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now));

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _vacinaServiceMock.Setup(s => s.GetById(1)).Returns(vacina);
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(existingVacinacoes);

        // Act
        var result = _service.Create(newVacinacao);

        // Assert
        result.Should().BeSameAs(newVacinacao);
        _repositoryMock.Verify(r => r.Add(newVacinacao), Times.Once);
    }

    #endregion

    #region Update Tests

    [Fact]
    public void Update_WhenVacinacaoExists_ShouldUpdateAndReturn()
    {
        // Arrange
        var existingVacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now.AddDays(-10))) { Id = 1 };
        var newVacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now));
        var updatedVacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now)) { Id = 1 };

        _repositoryMock.Setup(r => r.GetById(1)).Returns(existingVacinacao);
        _mapperMock.Setup(m => m.CopyProperties(newVacinacao, existingVacinacao)).Returns(updatedVacinacao);

        // Act
        var result = _service.Update(1, newVacinacao);

        // Assert
        result.Should().BeSameAs(updatedVacinacao);
        _repositoryMock.Verify(r => r.Update(updatedVacinacao), Times.Once);
    }

    [Fact]
    public void Update_WhenVacinacaoDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var newVacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now));
        _repositoryMock.Setup(r => r.GetById(999)).Returns((Vacinacao?)null);

        // Act
        var act = () => _service.Update(999, newVacinacao);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Vacinação não encontrada com o id: {999}");
    }

    #endregion

    #region Delete Tests

    [Fact]
    public void Delete_WhenVacinacaoExists_ShouldRemove()
    {
        // Arrange
        var existingVacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now)) { Id = 1 };
        _repositoryMock.Setup(r => r.GetById(1)).Returns(existingVacinacao);

        // Act
        _service.Delete(1);

        // Assert
        _repositoryMock.Verify(r => r.Remove(existingVacinacao), Times.Once);
    }

    [Fact]
    public void Delete_WhenVacinacaoDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetById(999)).Returns((Vacinacao?)null);

        // Act
        var act = () => _service.Delete(999);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Vacinação não encontrada com o id: {999}");
    }

    #endregion

    #region GetById Tests

    [Fact]
    public void GetById_WhenVacinacaoExists_ShouldReturn()
    {
        // Arrange
        var existingVacinacao = new Vacinacao(1, 1, DateOnly.FromDateTime(DateTime.Now)) { Id = 1 };
        _repositoryMock.Setup(r => r.GetById(1)).Returns(existingVacinacao);

        // Act
        var result = _service.GetById(1);

        // Assert
        result.Should().BeSameAs(existingVacinacao);
    }

    [Fact]
    public void GetById_WhenVacinacaoDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetById(999)).Returns((Vacinacao?)null);

        // Act
        var act = () => _service.GetById(999);

        // Assert
        act.Should().Throw<NotFoundException>()
            .WithMessage($"Vacinação não encontrada com o id: {999}");
    }

    #endregion

    #region GetAll Tests

    [Fact]
    public void GetAll_ShouldReturnAllVacinacoes()
    {
        // Arrange
        var vacinacoes = new List<Vacinacao>
        {
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddDays(-30))) { Id = 1 },
            new(2, 1, DateOnly.FromDateTime(DateTime.Now.AddDays(-15))) { Id = 2 }
        };
        _repositoryMock.Setup(r => r.GetAll()).Returns(vacinacoes);

        // Act
        var result = _service.GetAll();

        // Assert
        result.Should().BeEquivalentTo(vacinacoes);
    }

    #endregion

    #region FindByPessoaId Tests

    [Fact]
    public void FindByPessoaId_ShouldReturnVacinacoesForPessoa()
    {
        // Arrange
        var vacinacoes = new List<Vacinacao>
        {
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddDays(-30))) { Id = 1 },
            new(1, 2, DateOnly.FromDateTime(DateTime.Now.AddDays(-15))) { Id = 2 }
        };
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(vacinacoes);

        // Act
        var result = _service.FindByPessoaId(1);

        // Assert
        result.Should().BeEquivalentTo(vacinacoes);
    }

    #endregion

    #region FindAtrasadasByPessoaId Tests

    [Fact]
    public void FindAtrasadasByPessoaId_WhenPessoaNeverTookVaccine_ShouldReturnVacina()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var vacina = new Vacina("Hepatite B", 0, 1, false, 3, false, null) { Id = 1 };

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(new List<Vacinacao>());
        _vacinaServiceMock.Setup(s => s.GetAll()).Returns(new List<Vacina> { vacina });

        // Act
        var result = _service.FindAtrasadasByPessoaId(1);

        // Assert
        result.Should().Contain(vacina);
    }

    [Fact]
    public void FindAtrasadasByPessoaId_WhenPessoaCompletedAllDoses_ShouldNotReturnVacina()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var vacina = new Vacina("Hepatite B", 0, 1, false, 2, false, null) { Id = 1 };
        var vacinacoes = new List<Vacinacao>
        {
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-6))) { Id = 1 },
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-5))) { Id = 2 }
        };

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(vacinacoes);
        _vacinaServiceMock.Setup(s => s.GetAll()).Returns(new List<Vacina> { vacina });

        // Act
        var result = _service.FindAtrasadasByPessoaId(1);

        // Assert
        result.Should().NotContain(vacina);
    }

    [Fact]
    public void FindAtrasadasByPessoaId_WhenNextDoseIsOverdue_ShouldReturnVacina()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var vacina = new Vacina("Hepatite B", 0, 1, false, 3, false, null) { Id = 1 };
        var vacinacoes = new List<Vacinacao>
        {
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-3))) { Id = 1 }
        };

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(vacinacoes);
        _vacinaServiceMock.Setup(s => s.GetAll()).Returns(new List<Vacina> { vacina });

        // Act
        var result = _service.FindAtrasadasByPessoaId(1);

        // Assert
        result.Should().Contain(vacina);
    }

    [Fact]
    public void FindAtrasadasByPessoaId_WhenVacinaRequiresOlderAge_ShouldNotReturnVacina()
    {
        // Arrange
        var pessoa = new Pessoa("Bebê", 1, SexoEnum.Masculino) { Id = 1 };
        var vacina = new Vacina("HPV", 9, 6, false, 2, false, null) { Id = 1 };

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(new List<Vacinacao>());
        _vacinaServiceMock.Setup(s => s.GetAll()).Returns(new List<Vacina> { vacina });

        // Act
        var result = _service.FindAtrasadasByPessoaId(1);

        // Assert
        result.Should().NotContain(vacina);
    }

    [Fact]
    public void FindAtrasadasByPessoaId_WhenNextDoseIsNotYetDue_ShouldNotReturnVacina()
    {
        // Arrange
        var pessoa = new Pessoa("João Silva", 30, SexoEnum.Masculino) { Id = 1 };
        var vacina = new Vacina("Hepatite B", 0, 6, false, 3, false, null) { Id = 1 };
        var vacinacoes = new List<Vacinacao>
        {
            new(1, 1, DateOnly.FromDateTime(DateTime.Now.AddMonths(-2))) { Id = 1 }
        };

        _pessoaServiceMock.Setup(s => s.GetById(1)).Returns(pessoa);
        _repositoryMock.Setup(r => r.FindByPessoaId(1)).Returns(vacinacoes);
        _vacinaServiceMock.Setup(s => s.GetAll()).Returns(new List<Vacina> { vacina });

        // Act
        var result = _service.FindAtrasadasByPessoaId(1);

        // Assert
        result.Should().NotContain(vacina);
    }

    #endregion
}