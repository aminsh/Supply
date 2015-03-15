using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using Domain.Data;

namespace DataAccess.EntityFramework
{
    public class EntityFrameworkRepository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        private readonly DbContext _context;

        public EntityFrameworkRepository(DbContext context)
        {
            _context = context;
        }
        public void Add(TEntity entity)
        {
            _context.Set<TEntity>().Add(entity);
        }

        public void Delete(TEntity entity)
        {
            _context.Entry(entity).State = EntityState.Deleted;
        }

        public void DeleteById(object id)
        {
            Delete(FindById(id));
        }

        public void Modify(TEntity entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
        }

        public IQueryable<TEntity> Query()
        {
            return _context.Set<TEntity>();
        }

        public TEntity Find(Expression<Func<TEntity, bool>> expression)
        {
            return _context.Set<TEntity>().FirstOrDefault(expression);
        }

        public TEntity FindById(object id)
        {
            return _context.Set<TEntity>().Find(id);
        }
    }
}
