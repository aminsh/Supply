using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class ItemGoodInStock : Entity
    {
        [Display(Name = "انبار")]
        [ForeignKey("StockID")]
        public virtual Stock Stock { get; set; }

        [Required(ErrorMessage = "انبار الزامی است")]
        public virtual Int32 StockID { get; set; }

        [Display(Name = "کالا")]
        [ForeignKey("ItemGoodID")]
        public virtual ItemGood ItemGood { get; set; }

        [Required(ErrorMessage = "کالا الزامی است")]
        public virtual Int32 ItemGoodID { get; set; }
    }
}
