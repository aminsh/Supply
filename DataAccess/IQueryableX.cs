using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace DataAccess
{
    public static class IQueryableX
    {
        public static IQueryable<TEntity> IncludeX<TEntity>(this IQueryable<TEntity> source, Expression<Func<TEntity, Object>> column)
            where TEntity : Entity
        {
            return source.Include(column);
        }
    }
}
