using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Helper.Extensions;
using Helper.MyHelper;

namespace Helper.Reflection
{
    public static class ReflectionHelper
    {
        public static Type GetTypeFromString<T>(string stringObject)
        {
            var assembly = Assembly.GetAssembly(typeof(T));
            return assembly.GetType(stringObject.ToPascalCase());
        }

        public static T GetPropertyValueFromObject<T>(Object obj, String propName)
        {
            var prop = obj.GetType().GetProperty(propName);
            var result = (T)prop.GetValue(obj, null);
            return result;
        }

        public static Type GetTypeFromName(String typeAssemblyQualifiedName, Boolean nameIsFull = true, params Assembly[] assemblies)
        {
            Type type = null;

            if (nameIsFull)
            {
                type = Type.GetType(typeAssemblyQualifiedName);

                if (type != null)
                    return type;

                type = Assembly.GetCallingAssembly().GetType(typeAssemblyQualifiedName);

                if (type != null)
                    return type;

                if (assemblies == null || !assemblies.Any())
                    return null;

                foreach (var assembly in assemblies)
                {
                    type = assembly.GetType(typeAssemblyQualifiedName);
                    if (type != null)
                        return type;
                }
            }

            foreach (var asm in assemblies)
            {
                foreach (var typ in asm.GetTypes())
                {
                    if (typ.Name.Equals(typeAssemblyQualifiedName))
                        return typ;
                }
            }

            return null;
        }
    }
}
