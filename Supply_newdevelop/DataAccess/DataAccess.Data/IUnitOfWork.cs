

namespace Domain.Data
{
    public interface IUnitOfWork
    {
        void Commit();
        IRepository<TEntity> GetRepository<TEntity>();
    }
}
