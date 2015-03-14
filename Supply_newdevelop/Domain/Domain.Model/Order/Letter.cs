using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Order
{
    public class Letter : EntityBase
    {
        public string Number { get; set; }
        public DateTime Date { get; set; }
        public virtual Section Performer { get; set; }
    }
}
