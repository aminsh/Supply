using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BussinessLogic
{
    public static class Tools
    {
        public static object GetValue(this Dictionary<string, object> source,string key)
        {
            var obj = source.FirstOrDefault(s => s.Key == key);
            return obj.Value;
        }
    }
}
