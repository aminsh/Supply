using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace Helper
{
    public static class JsonHelper
    {
        public static IEnumerable<T> JsonToObject<T>(this String exp)
        {
            if (exp == null) return null;
            var jss = new JavaScriptSerializer();
            return jss.Deserialize<IEnumerable<T>>(exp);
        }

        
        public static String ObjectToJson<T>(this IEnumerable<T> source)
        {
            var jss = new JavaScriptSerializer();
            return jss.Serialize(source);
        }

        public static T ConvertToObject<T>(String exp)
        {
            var jss = new JavaScriptSerializer();
            return jss.Deserialize<T>(exp);
        }

        public static String ConvertToJson(this object obj)
        {
            var jss = new JavaScriptSerializer();
            return jss.Serialize(obj);
        }

    }
}
