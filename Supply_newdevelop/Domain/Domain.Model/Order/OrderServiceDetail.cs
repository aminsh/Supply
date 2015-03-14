using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Model.Order;

namespace Domain.Model
{
    public class OrderServiceDetail : EntityBase
    {
        public int Row { get; set; }
        public virtual Service Service { get; set; }
        public double Qty { get; set; }
        public double Price { get; set; }
        public virtual ICollection<ExtraCost> ExtraCosts { get; set; }
        public virtual ICollection<CostDetail> CostDetails { get; set; }
    }
}
