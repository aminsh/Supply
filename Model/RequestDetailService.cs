using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestDetailService : RequestDetail
    {
        [Display(Name = "درخواست")]
        [ForeignKey("RequestServiceID")]
        public virtual RequestService RequestService { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestServiceID { get; set; }

        [Display(Name = "کالا")]
        [ForeignKey("ItemServiceID")]
        public virtual ItemService ItemService { get; set; }

        [Required(ErrorMessage = "کالا الزامی است")]
        public virtual Int32 ItemServiceID { get; set; }

        //[Display(Name = "واحد")]
        //[ForeignKey("ScaleID")]
        //public virtual Scale Scale { get; set; }

        //[Required(ErrorMessage = "واحد اندازه گیری الزامی است")]
        //public virtual Int32 ScaleID { get; set; }

        public virtual ICollection<SmallCostServiceDetail> SmallCostServiceDetails { get; set; }

        public virtual ICollection<EffectiveCostServiceDetail> EffectiveCostServiceDetails { get; set; }
    }
    
}
