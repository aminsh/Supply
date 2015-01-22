using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace BussinessLogic.RequestReview
{
    public class Parameters
    {
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public Section Section { get; set; }

        public Letter Letter { get; set; }

        public Item Item { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public RequestType RequestType { get; set; }

        public PurchaseSize PurchaseSize { get; set; }

        public ReportType ReportType { get; set; }

        public StepType StepType { get; set; }
    }

    public enum OrderStatus
    {
        [Display(Name = "خرید شده")]
        Done,
        [Display(Name = "خرید نشده")]
        Pending
    }

    public enum ReportType
    {
        [Display(Name = "کلی")]
        Grouped,
        [Display(Name = "جزئی")]
        Small
    }

    public enum StepType
    {
        [Display(Name = "درخواست")]
        Request,
        [Display(Name = "سفارش خرید")]
        Order
    }
}
