using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Letter : Entity
    {
        [Display(Name = "شماره")]
        [Required(ErrorMessage = "شماره الزامی است")]
        public virtual String No { get; set; }

        [Display(Name = "تاریخ")]
        [Required(ErrorMessage = "تاریخ الزامی است")]
        public virtual DateTime Date { get; set; }

        [Display(Name = "اقدام کننده")]
        [ForeignKey("PerformerSectionID")]
        public virtual Section PerformerSection { get; set; }

        //[Required(ErrorMessage = "اقدام کننده الزامی است")]
        public virtual Int32? PerformerSectionID { get; set; }
    }

    public class LetterRequestGood : Letter
    {
        [ForeignKey("RequestGoodID")]
        public virtual RequestGood RequestGood { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestGoodID { get; set; }
    }

    public class LetterRequestService: Letter
    {
        [ForeignKey("RequestServiceID")]
        public virtual RequestService RequestService { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestServiceID { get; set; }
    }

    public class LetterRequestFood : Letter
    {
        [ForeignKey("RequestFoodID")]
        public virtual RequestFood RequestFood { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestFoodID { get; set; }
    }

    public class LetterRequestVehicle : Letter
    {
        [ForeignKey("RequestVehicleID")]
        public virtual RequestVehicle RequestVehicle { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestVehicleID { get; set; }
    }

    public class LetterRequestTicket : Letter
    {
        [ForeignKey("RequestTicketID")]
        public virtual RequestTicket RequestTicket { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestTicketID { get; set; }
    }
}
