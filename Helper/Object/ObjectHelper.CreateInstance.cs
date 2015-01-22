using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Helper.Reflection;

namespace Helper
{
    public class ObjectHelper
    {
        public static T CrateInstance<T>()
        {
            return (T)CreateInstance(typeof(T));
        }

        public static Object CreateInstance(Type type)
        {
            return Activator.CreateInstance(type);
        }

        public static Object CreateInstance(String typeAssemblyQualifiedName, Assembly[] assemblies = null)
        {
            var type = ReflectionHelper.GetTypeFromName(typeAssemblyQualifiedName, nameIsFull: false, assemblies: assemblies);
            return CreateInstance(type);
        }

        public static Object CreateInstance(Type type, Boolean nonPublic)
        {
            return Activator.CreateInstance(type, nonPublic);
        }

        public static object CreateInstance(Type type, params object[] args)
        {
            return Activator.CreateInstance(type, args);
        }

        public static T CreateInstance<T>()
        {
            return CreateInstance<T>(null);
        }

        public static T CreateInstance<T>(params object[] args)
        {
            return (T)Activator.CreateInstance(typeof(T), args);
        }
    }
}
