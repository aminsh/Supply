using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class Good : EntityBase, IItem
    {
        public string Title { get; set; }
        public string Des { get; set; }
        public double Price { get; set; }
        public Scale Scale { get; set; }
    }
}
