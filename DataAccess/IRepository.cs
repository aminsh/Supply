using System.Linq;
using Model;


namespace DataAccess
{
    public interface IRepository<TEntity>
        where TEntity:Entity,new()
    {
        void AddEntity(TEntity entity);

        void DeleteEntity(TEntity entity);

        void ModifyEntity(TEntity entity);

        IQueryable<TEntity> Query();
    }

}
