using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class Everyone : Person
    {
        public int Id { get; set; }
        public string Location { get; set; }
    }
}
