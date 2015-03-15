using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core
{
    public class ValidationException : Exception
    {
        public IList<Error> Errors { get; set; }
    }
}
