using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Kendo.DynamicLinq;

namespace Core
{
    public static class KendoExtension
    {
        public static DataSourceResult ToDataSourceResult<T, TResult>(this IQueryable<T> queryable, DataSourceRequest request, Func<T, TResult> mapper)
        {
            var result = queryable.ToDataSourceResult(request);
            var data = result.Data.Cast<IEnumerable<T>>();

            result.Data = data.Select(mapper);

            return result;
        }
    }
}
