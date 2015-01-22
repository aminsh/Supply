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
    public class ItemService : Item
    {
        [Display(Name = "گروه")]
        [ForeignKey("ParentID")]
        public virtual ItemService Parent { get; set; }

        public virtual Int32? ParentID { get; set; }

        //public ICollection<Item> Children { get; set; }

        public virtual String FullName
        {
            get { return Title; }
        }
    }

}
