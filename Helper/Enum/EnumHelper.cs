using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Helper
{
    public class EnumX
    {
        public Int32 ID { get; set; }
        public String Name { get; set; }
        public String DisplayName { get; set; }
    }

    public class EnumHelper
    {
        public static String GetDisplayNameFromEnum(string eNumString, Type type)
        {
            var memberInfo = type.GetMember(eNumString);
            var attributes = memberInfo[0].GetCustomAttributes(typeof(DisplayAttribute), false);

            return !attributes.Any()
                       ? eNumString
                       : ((DisplayAttribute) attributes[0]).Name;
        }

        public static IEnumerable<EnumX> GetEnumXs(string eNumString, Type type)
        {
            var eNumList = Enum.GetNames(type);

            return eNumList.Select((t, i) => new EnumX
            {
                ID = i,
                Name = t,
                DisplayName = GetDisplayNameFromEnum(t, type)
            });
        }
    }
}
