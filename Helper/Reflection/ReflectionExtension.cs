using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using Helper.Reflection;

namespace Helper.Extensions
{
    public static class ReflectionExtension
    {
        public static PropertyInfo GetProperty(this Type type, String propName)
        {
            var allProps = type.GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly);

            var prop = allProps.Single(p => p.Name == propName);

            return prop;
        }

#if SILVERLIGHT
        public static PropertyInfo GetKeyProperty(this Type type)
        {
            var allProps = type.GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly);

            foreach (var prp in allProps)
            {
                if (prp.GetCustomeAttribte<KeyAttribute>() != null)
                    return prp;
            }

            return null;
        }
#endif

        public static TAtt GetCustomeAttribte<TAtt>(this MemberInfo member, Boolean inherit = false)
            where TAtt : Attribute
        {
            var allAtts = member.GetCustomAttributes(typeof(TAtt), inherit).OfType<TAtt>();
            if (allAtts.Any())
                return allAtts.Single();
            else
                return null;
        }

        public static TAtt GetCustomeAttribte<TAtt>(this Type type, Boolean inherit = false)
            where TAtt : Attribute
        {
            var allAtts = type.GetCustomAttributes(typeof(TAtt), inherit).OfType<TAtt>();
            if (allAtts.Any())
                return allAtts.Single();
            else
                return null;
        }

        public static Boolean TypeIsInAssemblies(this Type type, params String[] assemblyNames)
        {
            var typeAssemblyName = type.Assembly.FullName;

            if (assemblyNames != null && assemblyNames.Any(asm => typeAssemblyName.Contains(asm)))
                return true;
            else
                return false;
        }

        public static PropertyInfo GetKey(this Type objType)
        {
            var allProps = objType.GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (var prp in allProps)
            {
                if (prp.GetCustomeAttribte<KeyAttribute>() != null)
                    return prp;
            }

            foreach (var prp in allProps)
            {
                if (prp.Name == String.Format("{0}ID", objType.Name))
                    return prp;
            }

            objType = objType.Assembly.GetTypes().FirstOrDefault(type => type.Name.Contains("Metadata") && type.Name.Contains(objType.Name));

            if (objType != null)
                return GetKey(objType);

            return null;
        }

        public static Object ReadProperty(this Object obj, String propertyName)
        {
            var type = obj.GetType();

            var prop = type.GetProperty(propertyName);

            return prop.GetValue(obj, null);
        }

        public static Boolean HasRequiredAttribute(this PropertyInfo prop)
        {
            var requiredAtt = prop.GetCustomeAttribte<RequiredAttribute>();
            return requiredAtt != null;
        }

        public static Boolean HasCustomeAttribte<TAttr>(this PropertyInfo prop) where TAttr : Attribute
        {
            var attr = prop.GetCustomeAttribte<TAttr>();
            return attr != null;
        }

        public static String RequiredAttributeErrorMessage(this PropertyInfo prop)
        {
            var requiredAtt = prop.GetCustomeAttribte<RequiredAttribute>();
            if (requiredAtt != null)
                return requiredAtt.ErrorMessage != string.Empty
                           ? requiredAtt.ErrorMessage
                           : string.Format("{0} is required", prop.Name);
            return string.Empty;
        }

        public static Boolean HasStringLengthAttribute(this PropertyInfo prop)
        {
            var stringLength = prop.GetCustomAttribute<StringLengthAttribute>();
            return stringLength != null;
        }

        public static String StringLenghtAttributeErrorMessage(this PropertyInfo prop)
        {
            var stringLenght = prop.GetCustomAttribute<StringLengthAttribute>();
            if (stringLenght != null)
                return stringLenght.ErrorMessage != string.Empty
                           ? stringLenght.ErrorMessage
                           : string.Format("{0} must be between {1} and {2}", prop.Name, stringLenght.MinimumLength, stringLenght.MaximumLength);
            return string.Empty;

        }

        public static String DisplayColumnAttributeDisplayColumn(this Type type)
        {
            var displayColumn = type.GetCustomAttribute<DisplayColumnAttribute>();
            if (displayColumn != null)
                return displayColumn.DisplayColumn;

            return string.Empty;

        }

        public static StringLengthAttribute StringLenghtAttribute(this PropertyInfo prop)
        {
            var stringLenght = prop.GetCustomAttribute<StringLengthAttribute>();
            return stringLenght;
        }

        public static String GetPropTitle(this PropertyInfo prop)
        {
            var displayAtt = prop.GetCustomeAttribte<DisplayAttribute>();

            if (displayAtt != null)
                return displayAtt.Name;

            return prop.Name;
        }
    }
}