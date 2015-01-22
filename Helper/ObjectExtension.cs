using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;

namespace System
{
    public static class ObjectExtensions
    {
        public static Boolean IsNull(this Object value)
        {
            return Object.ReferenceEquals(value, null) || Object.ReferenceEquals(value, DBNull.Value);
        }
        public static T Convert<T>(this Object value)
        {
            if (!value.IsNull() && value is IEnumerable && !(value is String))
                throw new InvalidOperationException("Please use ConvertArray<T> instead of Convert<T>");

            var result = default(T);

            if (value.IsNull())
                return result;

            var desType = typeof(T);

            if (desType.Name.Contains("Nullable"))
                desType = Nullable.GetUnderlyingType(desType);

            var objType = value.GetType();

            TypeConverter converter = new TypeConverter();

            Boolean useGlobalCulture = true;

            var typeName = desType.Name.ToLowerInvariant();

            if ((typeName == "decimal" || typeName == "double" || typeName == "float") && value is String)
            {
                useGlobalCulture = false;
                var numberCommaOfCurrentSystem = CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator;
                value = value.ToString().Replace("/", numberCommaOfCurrentSystem);
                value = value.ToString().Replace(".", numberCommaOfCurrentSystem);
            }

            if (converter.CanConvertTo(desType))
                result = (T)converter.ConvertTo(value, desType);
            else if (desType.IsEnum)
                result = (T)Enum.ToObject(desType, value);
            else
            {
                if (useGlobalCulture)
                    result = (T)System.Convert.ChangeType(value, desType, CultureInfo.InvariantCulture);
                else
                    result = (T)System.Convert.ChangeType(value, desType, CultureInfo.CurrentCulture);
            }
            return result;

        }

        public static IEnumerable<T> ConvertArray<T>(this IEnumerable source)
        {

            //source.select()
            //return from object item in source select Convert<T>(item);
            return null;
        }

        public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            if (source == null)
                throw new ArgumentNullException("source");

            if (action == null)
                throw new ArgumentNullException("source");

            foreach (T item in source)
                action(item);
        }

        public static T Cast<T>(this object value)
        {
            return (T)value;
        }

        public static Boolean IsIn<T>(this T obj, params T[] objects)
        {
            return objects != null && objects.Contains(obj);
        }
    }
}
