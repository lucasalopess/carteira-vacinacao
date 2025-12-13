namespace api.Repositories;

public interface IBaseRepository<T> where T : class
{
    void Add(T entity);
    T? GetById(int id);
    IEnumerable<T> GetAll();
    void Remove(T entity);
    void Update(T existingEntity);
}