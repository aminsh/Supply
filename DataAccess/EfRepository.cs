using System.Data;
using System.Data.Entity;
using System.Linq;
using Model;

namespace DataAccess
{
    public class EfRepository<TEntity> : IRepository<TEntity> 
        where TEntity : Entity,new()
    {
        private readonly DbContext _context;

        public EfRepository(DbContext context)
        {
            _context = context;
        }

        public void AddEntity(TEntity entity)
        {
            _context.Set<TEntity>().Add(entity);
        }

        public void DeleteEntity(TEntity entity)
        {
            _context.Delete(entity);
        }

        public void ModifyEntity(TEntity entity)
        {
            _context.Set<TEntity>().Attach(entity);
            var entry = _context.Entry(entity);
            entry.State = EntityState.Modified;
        }

        public IQueryable<TEntity> Query()
        {
            return _context.Set<TEntity>();
        }
    }

    public static class ContextExt
    {
        public static void Delete<TEntity>(this DbContext context, TEntity entity)
            where TEntity : class
        {
            var set = context.Set<TEntity>();
            entity = set.Attach(entity);
            var entry = context.Entry(entity);
            entry.State = EntityState.Deleted;
        }
    }
}
