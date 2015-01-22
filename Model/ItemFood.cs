using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    [DisplayColumn("Title")]
    public class ItemFood : Item
    {
        [Display(Name = "گروه")]
        [ForeignKey("ParentID")]
        public virtual ItemFood Parent { get; set; }

        public virtual Int32? ParentID { get; set; }

        //public ICollection<ItemFood> Children { get; set; }

    }

}
