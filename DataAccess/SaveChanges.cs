using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace DataAccess
{
    public partial class AppDbContext
    {
        public override int SaveChanges()
        {
            var context = ((IObjectContextAdapter)this).ObjectContext;
            var doneEntities = new List<object>();

            while (true)
            {
                IEnumerable<ObjectStateEntry> objectStateEntries =
                    context.ObjectStateManager.GetObjectStateEntries(EntityState.Added | EntityState.Modified)
                           .Where(e => e.IsRelationship == false && e.Entity != null && e.Entity is Entity).ToList();

                if (doneEntities.Count() == objectStateEntries.Select(o => o.Entity).Count())
                    break;

                objectStateEntries.ForEach(e =>
                    {
                        var entity = e.Entity;

                        if(doneEntities.Contains(entity))
                            return;

                        Type entityTypeName;

                        if (entity.GetType().Namespace.Contains("DynamicProxies"))
                            entityTypeName = entity.GetType().BaseType;
                        else
                            entityTypeName = entity.GetType();

                        // auth
                        Authorize(entityTypeName.Name, e.State);

                        var logicType =
                            _LogicAssembly.GetType(String.Format("BussinessLogic.BL{0}", entityTypeName.Name));

                        var originalValues = new Dictionary<String, Object>();

                        if (e.State.IsIn(EntityState.Modified, EntityState.Deleted))
                        {
                            var efOriginalValues = e.OriginalValues;
                            entityTypeName.GetProperties()
                                          .Where(
                                              p =>
                                              !(
                                                   p.SetMethod == null ||
                                                   (p.PropertyType.FullName.StartsWith("Model") && !p.IsEnum()) ||
                                                   p.PropertyType.FullName.Contains("ICollection"))
                                )
                                          .ForEach(prop => originalValues.Add(prop.Name, efOriginalValues[prop.Name]));
                        }

                        if (logicType != null)
                        {
                            var logicInstance = Activator.CreateInstance(logicType);

                            logicType.GetProperty("Context").SetValue(logicInstance, this);

                            logicType.GetMethod("OnSubmitEntity")
                                     .Invoke(logicInstance, new Object[] {entity, e.State, originalValues});
                        }
                    });

                doneEntities.Clear();
                doneEntities.AddRange(objectStateEntries.Select(o => o.Entity));
            }
           
            return base.SaveChanges();
        }
    }
}
