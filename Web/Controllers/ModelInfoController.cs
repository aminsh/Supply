using System;
using System.Collections.Generic;
using System.Data.Entity.Design.PluralizationServices;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using DataAccess;
using Helper.Extensions;
using Helper.MyHelper;
using Model;
using Model.Attributes;

namespace Web.Controllers
{
    public class ModelInfo
    {
        public String Name { get; set; }
        public String PluralName { get; set; }
        public String DisplayColumn { get; set; }
        public ICollection<Column> Columns { get; set; }
    }

    public class Column
    {
        public String Name { get; set; }
        public String Display { get; set; }
        public String Type { get; set; }
        public Boolean Filterable { get; set; }
        public ICollection<Validator> Validators { get; set; }
    }

    public class Validator
    {
        public String Name { get; set; }
        public String ErrorMessage { get; set; }
        public Int32 MinLength { get; set; }
        public Int32 MaxLength { get; set; }
    }

    
    public class ModelInfoController : ApiController
    {
        private static readonly PluralizationService NameService;

        static ModelInfoController()
        {
            NameService = PluralizationService.CreateService(new CultureInfo("en-us"));
        }

        public String GetTypeName(PropertyInfo prop)
        {
            string typeName;

            if (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof (Nullable<>))
                typeName = prop.PropertyType.GetGenericArguments()[0].FullName;
            else 
                typeName = prop.PropertyType.FullName;

            if (prop.IsEnum())
                typeName = typeName.Replace("Model", "Enum");

            return typeName;
        }

        public ICollection<Column> GetColumns(Type type)
        {
            var columns = new List<Column>();
            
            PropertyInfo[] props = type.GetProperties();
            
            props.ForEach(prop =>
                {
                    var validators = new List<Validator>();

                    if (prop.HasRequiredAttribute())
                    {
                        validators.Add(new Validator()
                            {
                                Name = "Required",
                                ErrorMessage = prop.RequiredAttributeErrorMessage()
                            });
                    }

                    if (prop.HasStringLengthAttribute())
                    {
                        validators.Add(new Validator()
                            {
                                Name = "StringLength",
                                ErrorMessage = prop.StringLenghtAttributeErrorMessage(),
                                MinLength = prop.StringLenghtAttribute().MinimumLength,
                                MaxLength = prop.StringLenghtAttribute().MaximumLength
                            });
                    }

                    columns.Add(new Column()
                        {
                            Name = prop.Name,
                            Type = GetTypeName(prop),
                            Filterable = prop.GetCustomAttribute<FilterableAttribute>() != null,
                            Display = prop.GetPropTitle(),
                            Validators = validators
                        });
                    
                });
    
            return columns;

        }

        [HttpGet]
        public IEnumerable<ModelInfo> GetModelInfos()
        {
            var asm = Assembly.GetAssembly(typeof(Entity));
            var types = asm.GetTypes();
            var modelInfos = new List<ModelInfo>();
            
            types.ForEach(item => modelInfos.Add(new ModelInfo()
                {
                    Name = item.Name,
                    PluralName = NameService.Pluralize(item.Name),
                    DisplayColumn = item.DisplayColumnAttributeDisplayColumn(),
                    Columns = GetColumns(item)
                }));

            return modelInfos;
        } 
    }
}
