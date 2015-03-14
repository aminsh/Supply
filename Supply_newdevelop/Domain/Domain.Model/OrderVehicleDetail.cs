using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class OrderVehicleDetail : EntityBase
    {
        public Vehicle Vehicle { get; set; }
        public double Qty { get; set; }
        public double Price { get; set; }
    }
}
