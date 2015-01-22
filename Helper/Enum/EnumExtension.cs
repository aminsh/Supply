using System.Reflection;

namespace System
{
    public static class EnumExtension
    {
        public static Boolean IsEnum(this PropertyInfo property)
        {
            return property.PropertyType.IsEnum || (property.PropertyType.IsGenericType &&
                         property.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) &&
                         property.PropertyType.GetGenericArguments()[0].IsEnum);
        }
    }
}