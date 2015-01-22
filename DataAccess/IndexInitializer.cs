using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Model.Attributes;

namespace DataAccess
{
    public class IndexInitializer<T> : IDatabaseInitializer<T> where T : DbContext 
    {
        private const string CreateIndexQueryTemplate = "CREATE {unique} INDEX {indexName} ON {tableName} ({columnName});";

        public void InitializeDatabase(T context)
        {
            const BindingFlags publicInstance = BindingFlags.Public | BindingFlags.Instance;
            var indexes = new Dictionary<IndexAttribute, List<string>>();
            string query = string.Empty;

            var dbsets = typeof (T).GetProperties(publicInstance)
                                              .Where(p => p.PropertyType.Name == typeof (DbSet<>).Name
                                                          &&

                                                          (typeof (AppDbContext).GetProperties(publicInstance)
                                                                                .Where(
                                                                                    et =>
                                                                                    et.PropertyType.Name ==
                                                                                    typeof (DbSet<>).Name)
                                                          ).All(
                                                              l =>
                                                              l.PropertyType.GetGenericArguments()[0] !=
                                                              p.PropertyType.GetGenericArguments()[0].BaseType));
           
            foreach (var dataSetProperty in dbsets)
            {
                var entityType = dataSetProperty.PropertyType.GetGenericArguments().Single();
                var tableAttributes = (TableAttribute[])entityType.GetCustomAttributes(typeof(TableAttribute), false);

                indexes.Clear();
                string tableName = tableAttributes.Length != 0 ? tableAttributes[0].Name : dataSetProperty.Name;

                foreach (PropertyInfo property in entityType.GetProperties(publicInstance))
                {
                    var indexAttributes = (IndexAttribute[])property.GetCustomAttributes(typeof(IndexAttribute), false);
                    var notMappedAttributes = (NotMappedAttribute[])property.GetCustomAttributes(typeof(NotMappedAttribute), false);
                    if (indexAttributes.Length > 0 && notMappedAttributes.Length == 0)
                    {
                        var columnAttributes = (ColumnAttribute[])property.GetCustomAttributes(typeof(ColumnAttribute), false);

                        foreach (IndexAttribute indexAttribute in indexAttributes)
                        {
                            if (!indexes.ContainsKey(indexAttribute))
                            {
                                indexes.Add(indexAttribute, new List<string>());
                            }

                            if (property.PropertyType.IsValueType || property.PropertyType == typeof(string))
                            {
                                string columnName = columnAttributes.Length != 0 ? columnAttributes[0].Name : property.Name;
                                indexes[indexAttribute].Add(columnName);
                            }
                            else
                            {
                                indexes[indexAttribute].Add(property.PropertyType.Name + "_" + GetKeyName(property.PropertyType));
                            }
                        }
                    }
                }

                foreach (IndexAttribute indexAttribute in indexes.Keys)
                {
                    query += CreateIndexQueryTemplate.Replace("{indexName}", indexAttribute.Name)
                                .Replace("{tableName}", tableName)
                                .Replace("{columnName}", string.Join(", ", indexes[indexAttribute].ToArray()))
                                .Replace("{unique}", indexAttribute.IsUnique ? "UNIQUE" : string.Empty);
                }
            }

            if (context.Database.CreateIfNotExists())
            {
                context.Database.ExecuteSqlCommand(query);
            }
        }

        private string GetKeyName(Type type)
        {
            PropertyInfo[] propertyInfos = type.GetProperties(BindingFlags.FlattenHierarchy | BindingFlags.Instance | BindingFlags.Public);
            foreach (PropertyInfo propertyInfo in propertyInfos)
            {
                if (propertyInfo.GetCustomAttribute(typeof(KeyAttribute), true) != null)
                    return propertyInfo.Name;
            }
            throw new Exception("No property was found with the attribute Key");
        }
    }
}
