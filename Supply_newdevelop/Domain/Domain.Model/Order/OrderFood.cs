using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Model.Order;

namespace Domain.Model
{
    public class OrderFood : EntityBase
    {
        public string Date { get; set; }
        public virtual Section Section { get; set; }
        public virtual Section ConsumerSection { get; set; }
        public virtual Employee Requester { get; set; }
        public PurchaseMethod PurchaseMethod { get; set; }
        public bool IsClosed { get; set; }
        public string ClosedDate { get; set; }
        public bool IsCancel { get; set; }
        public string CancelCause { get; set; }
        public virtual PurchasingOfficer PurchasingOfficer { get; set; }
        public string AssignedToOfficerOn { get; set; }
        public virtual ICollection<OrderFoodDetail> Details { get; set; }
        public virtual ICollection<Letter> Letters { get; set; }
    }

    public enum PurchaseMethod
    {
        Small,            //جزئی
        Quotation,        //استعلام
        Tender,           // مناقصه
        DirectDelivery,   // تحویل مستقیم
        Contract           // قرارداد
    }
}
