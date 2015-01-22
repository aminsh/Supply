using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestDetailTicket : RequestDetail
    {
        [Display(Name = "درخواست")]
        [ForeignKey("RequestTicketID")]
        public virtual RequestTicket RequestTicket { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestTicketID { get; set; }

        [ForeignKey("ItemTicketID")]
        public virtual ItemTicket ItemTicket { get; set; }

        public virtual Int32 ItemTicketID { get; set; }

        [Display(Name = "تاریخ رفت")]
        [Required(ErrorMessage = "تاریخ رفت الزامی است")]
        public virtual DateTime GoOnDate { get; set; }

        [Display(Name = "تاریخ برگشت")]
        //[Required(ErrorMessage = "تاریخ برگشت الزامی است")]
        public virtual DateTime ReturnDate { get; set; }

        [ForeignKey("PassengerID")]
        public virtual Person Passenger { get; set; }

        [Required(ErrorMessage = "مسافر الزامی است")]
        public virtual Int32 PassengerID { get; set; }

        [StringLength(50, MinimumLength = 3, ErrorMessage = "مقصد باید مابین 1 تا 50 کاراکتر باشد")]
        [Display(Name = "مقصد")]
        public virtual String Destination { get; set; }

        [StringLength(50, MinimumLength = 3, ErrorMessage = "مبدا باید مابین 1 تا 50 کاراکتر باشد")]
        [Display(Name = "مبدا")]
        public virtual String Origin { get; set; }

        [Display(Name = "شماره بلیط")]
        public virtual String TicketNo { get; set; }

        [Display(Name = "قیمت رفت")]
        public virtual Double GoOnPrice { get; set; }

        [Display(Name = "قیمت برگشت")]
        public virtual Double ReturnPrice { get; set; }

        public virtual ICollection<EffectiveCostTicketDetail> EffectiveCostTicketDetails { get; set; }
    }
}
