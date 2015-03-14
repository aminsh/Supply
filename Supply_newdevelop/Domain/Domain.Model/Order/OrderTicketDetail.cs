using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Model.Order;

namespace Domain.Model
{
    public class OrderTicketDetail : EntityBase
    {
        public int Row { get; set; }
        public virtual Person Person { get; set; }
        public string TicketNumber { get; set; }
        public DateTime GoOnDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public double GoOnPrice { get; set; }
        public double ReturnPrice { get; set; }
        public virtual ICollection<ExtraCost> ExtraCosts { get; set; }
        public virtual ICollection<CostDetail> CostDetails { get; set; }
    }
}
