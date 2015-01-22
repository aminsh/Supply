using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class InventoryDetail : Entity
    {
        [Display(Name = "ردیف")]
        public virtual Int32 Row { get; set; }

        [Display(Name = "کالا")]
        [ForeignKey("ItemGoodID")]
        public virtual ItemGood ItemGood { get; set; }

        [Required(ErrorMessage = "کالا الزامی است")]
        public virtual Int32 ItemGoodID { get; set; }

        [Display(Name = "تعداد/ مقدار")]
        public virtual Double Qty { get; set; }

        [Display(Name = "توضیحات")]
        public virtual String Des { get; set; }

        [Display(Name = "سفارش خرید")]
        [ForeignKey("RequestGoodID")]
        public virtual RequestGood RequestGood { get; set; }

        public virtual Int32? RequestGoodID { get; set; }

    }
}
