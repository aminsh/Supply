using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Order
{
    public class ExtraCost : EntityBase
    {
        public virtual CostType CostType { get; set; }
        public double Cost { get; set; }
    }

    public class CostType : EntityBase
    {
        public string Title { get; set; }
    }
}
