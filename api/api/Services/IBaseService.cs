namespace api.Services;

public interface IBaseService<T> where T : class
{
    T Create(T entity);
    T Update(int id, T newPessoa);
    void Delete(int id);
    T GetById(int id);
    IEnumerable<T> GetAll();
}