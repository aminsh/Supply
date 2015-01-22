using System;
using Model;

namespace DataAccess
{
    // Unit Of Work
    public interface IWorkUnit : IDisposable
    {
        void SaveChanges();

        IRepository<TEntity> GetRepository<TEntity>()
           where TEntity : Entity, new();
    }
}
