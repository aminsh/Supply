using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;
using System.Reflection;
using DataAccess;
using Model;

namespace BussinessLogic
{
    public class BLBase<TEntity>
        where TEntity : Entity
    {
        public virtual void OnSubmitEntity(TEntity entity,EntityState state, Dictionary<String, Object> originalValues)
        {
            //I think this part used for silverlight app & wcfdataServices
            //var propsOfEntity = typeof(TEntity).GetProperties(BindingFlags.Instance | BindingFlags.Public);

            //foreach (var prp in propsOfEntity)
            //{
            //    entity.GetErrors(prp.Name);

            //    if (entity.HasErrors)
            //        throw new InvalidOperationException(entity.GetErrorMessage(prp.Name));
            //}
        }


        public object GetOrginalValue(Dictionary<string, object> source, Expression<Func<TEntity, Object>> column)
        {
            var prop = column.GetColumnInfo();
            //Type type = prop.PropertyType;
                
            return source.GetValue(prop.Name);
        }

        public AppDbContext Context { get; set; }
    }
}
