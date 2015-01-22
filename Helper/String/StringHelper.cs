using System;
using System.Collections.Generic;
using System.Data.Entity.Design.PluralizationServices;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Helper.MyHelper
{
    public static class StringHelper
    {
        public static string ToPascalCase(this string s)
        {
            // Check for empty string.
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }
            // Return char and concat substring.
            return char.ToUpper(s[0]) + s.Substring(1);
        }

        public static string ToSingularize(this string word)
        {
            var nameService = PluralizationService.CreateService(new CultureInfo("en-us"));
            return nameService.Singularize(word);
        }

        public static string ToPluralize(this string word)
        {
            var nameService = PluralizationService.CreateService(new CultureInfo("en-us"));
            return nameService.Pluralize(word);
        }
    }
}
