using Model;

namespace DataAccess
{
    public class EfWorkUnit : IWorkUnit
    {
        private readonly  AppDbContext _context=new AppDbContext();

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public IRepository<TEntity> GetRepository<TEntity>() 
            where TEntity : Entity, new()
        {
            return new EfRepository<TEntity>(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
