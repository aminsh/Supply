using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core
{
    public static class ObjectExtention
    {
        public static TType Cast<TType>(this object obj)
        {
            return (TType) obj;
        }
    }
}
