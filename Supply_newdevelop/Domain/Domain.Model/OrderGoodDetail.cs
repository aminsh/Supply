using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class OrderGoodDetail : EntityBase
    {
        public virtual Good Good { get; set; }
        public double Qty { get; set; }
        public double Price { get; set; }
    }
}
