namespace api.Mappers;

public interface IBaseMapper<TEntity, TRequestDto, TResponseDto>
    where TEntity : class
    where TRequestDto : class
    where TResponseDto : class
{
    public TEntity FromDto(TRequestDto dto);

    public TResponseDto ToDto(TEntity entity);

    public TEntity CopyProperties(TEntity source, TEntity target);

    public ICollection<TResponseDto> ToDto(ICollection<TEntity> entities);
}