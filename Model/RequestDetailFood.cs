using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestDetailFood : RequestDetail
    {
        [Display(Name = "درخواست")]
        [ForeignKey("RequestFoodID")]
        public virtual RequestFood RequestFood { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestFoodID { get; set; }

        [Display(Name = "کالا")]
        [ForeignKey("ItemFoodID")]
        public virtual ItemFood ItemFood { get; set; }

        [Required(ErrorMessage = "کالا الزامی است")]
        public virtual Int32 ItemFoodID { get; set; }

        public virtual ICollection<EffectiveCostFoodDetail> EffectiveCostFoodDetails { get; set; }

        //[Display(Name = "واحد")]
        //[ForeignKey("ScaleID")]
        //public virtual Scale Scale { get; set; }

        //[Required(ErrorMessage = "واحد اندازه گیری الزامی است")]
        //public virtual Int32 ScaleID { get; set; }
    }
}
