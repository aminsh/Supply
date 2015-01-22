using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestDetailGood : RequestDetail
    {
        [Display(Name = "درخواست")]
        [ForeignKey("RequestGoodID")]
        public virtual RequestGood RequestGood { get; set; }

        public virtual Int32 RequestGoodID { get; set; }

        [Display(Name = "کالا")]
        [ForeignKey("ItemGoodID")]
        public virtual ItemGood ItemGood { get; set; }

        [Required(ErrorMessage = "کالا الزامی است")]
        public virtual Int32 ItemGoodID { get; set; }

        //[Display(Name = "رسید انبار")]
        //public virtual Input Input { get; set; }

        //public virtual Int32? InputID { get; set; }

        [ForeignKey("InputDetailID")]
        [Display(Name = "ردیف رسید انبار")]
        public virtual InputDetail InputDetail { get; set; }

        public virtual Int32? InputDetailID { get; set; }

        [ForeignKey("OutputDetailID")]
        [Display(Name = "ردیف حواله انبار")]
        public virtual OutputDetail OutputDetail { get; set; }

        public virtual Int32? OutputDetailID { get; set; }

        public virtual ICollection<EffectiveCostGoodDetail> EffectiveCostGoodDetails { get; set; }

    }
}
