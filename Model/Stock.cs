using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    [DisplayColumn("Title")]
    public class Stock : EntityBasic
    {
        [Display(Name = "آدرس")]
        public virtual String Address { get; set; }

        public virtual ICollection<ItemGoodInStock> ItemGoodInStocks { get; set; }
    }

}
