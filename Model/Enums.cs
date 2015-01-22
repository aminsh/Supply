using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public enum PurchaseMethod
    {
        [Display(Name = "جزئی")]
        Small,
        [Display(Name = "استعلام")]
        Quotation,
        [Display(Name = "مناقصه")]
        Tender,
        [Display(Name = "تحویل مستقیم")]
        DirectDelivery,
        [Display(Name = "قرارداد")]
        Cotract
    }

    public enum  PurchaseSize
    {
        [Display(Name = "خرید های کوچک")]
        Small,
        [Display(Name = "خرید های متوسط")]
        Middle,
        [Display(Name = "خرید های بزرگ")]
        Large
    }
    public enum NatureCost
    {
        [Display(Name = "اضافه شود")]
        Positive,
        [Display(Name = "کسر شود")]
        Negative
    }

    public enum RequestType
    {
        [Display(Name = "کالا")]
        Good,
        [Display(Name = "خدمات")]
        Service,
        [Display(Name = "میوه و شیرینی")]
        Food,
        [Display(Name = "تعمیرات نقلیه")]
        Vehicle,
        [Display(Name = "بلیط های مسافرتی")]
        Ticket
    }
}
