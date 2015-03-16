using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Model.Order;

namespace Domain.Model
{
    public class OrderGood : EntityBase
    {
        public DateTime Date { get; set; }
        public bool IsClosed { get; set; }
        public DateTime ClosedDate { get; set; }
        public bool IsCancel { get; set; }
        public string CancelCause { get; set; }
        public PurchasingOfficer PurchasingOfficer { get; set; }
        public DateTime AssignedToOfficerOn { get; set; }
        public virtual ICollection<OrderGoodDetail> Details { get; set; }
        public virtual ICollection<Letter> Letters { get; set; }
    }
}
