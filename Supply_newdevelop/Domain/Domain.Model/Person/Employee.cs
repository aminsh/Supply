using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class Employee : Person
    {
        public string Position { get; set; }
        public string Department { get; set; }
        public virtual Section Section { get; set; }
    }
}
