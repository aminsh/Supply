using System;
using System.Linq;
using System.Linq.Expressions;

namespace Domain.Data
{
    public interface IRepository<TEntity> 
    {
        void Add(TEntity entity);
        void Modify(TEntity entity);
        void Delete(TEntity entity);
        TEntity FindById(int id);
        TEntity Find(Expression<Func<TEntity, bool>> expression);
        IQueryable<TEntity> Query();
    }
}
