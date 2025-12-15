using System.Text.Json.Serialization;
using api.Data;
using api.Dtos;
using api.Mappers;
using api.Middleware;
using api.Models;
using api.Repositories;
using api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace api;

public static class Startup
{
    private const string CorsPolicyName = "AllowWebApp";

    public static IServiceCollection RegisterServices(this IServiceCollection services, IConfiguration configuration)
    {
        var host = configuration["POSTGRES_HOST"] ?? Environment.GetEnvironmentVariable("POSTGRES_HOST");
        var port = configuration["POSTGRES_PORT"] ?? Environment.GetEnvironmentVariable("POSTGRES_PORT");
        var db = configuration["POSTGRES_DB"] ?? Environment.GetEnvironmentVariable("POSTGRES_DB");
        var user = configuration["POSTGRES_USER"] ?? Environment.GetEnvironmentVariable("POSTGRES_USER");
        var pass = configuration["POSTGRES_PASSWORD"] ?? Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");

        var connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={pass}";

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddCors(options =>
        {
            options.AddPolicy(CorsPolicyName,
                builder =>
                {
                    builder.WithOrigins("http://localhost:4300", "https://carteira-vacinacao.lucasalopes.com.br")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });

        // Serialização de Enums como Strings no JSON
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "API Carteira de Vacinação", Version = "v1" });
        });

        // Repositories, Mappers e Services
        services.AddScoped<IPessoaRepository, PessoaRepository>();
        services.AddScoped<IVacinaRepository, VacinaRepository>();
        services.AddScoped<IVacinacaoRepository, VacinacaoRepository>();

        services.AddSingleton<IBaseMapper<Pessoa, PessoaRequestDto, PessoaResponseDto>, PessoaMapper>();
        services.AddSingleton<IBaseMapper<Vacina, VacinaRequestDto, VacinaResponseDto>, VacinaMapper>();
        services.AddSingleton<IBaseMapper<Vacinacao, VacinacaoRequestDto, VacinacaoResponseDto>, VacinacaoMapper>();

        services.AddScoped<IPessoaService, PessoaService>();
        services.AddScoped<IVacinaService, VacinaService>();
        services.AddScoped<IVacinacaoService, VacinacaoService>();

        return services;
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            try
            {
                dbContext.Database.Migrate();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao aplicar migrations: {ex.Message}");
                throw;
            }
        }

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "API Carteira de Vacinação V1");
            });
        }

        app.UseMiddleware<GlobalExceptionHandler>();
        app.UseHttpsRedirection();

        app.UseCors(CorsPolicyName);

        app.UseAuthorization();
        app.MapControllers();

        return app;
    }
}