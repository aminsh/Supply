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
    public class ItemTicket : Item
    {
        [Display(Name = "گروه")]
        [ForeignKey("ParentID")]
        public virtual ItemTicket Parent { get; set; }

        public virtual Int32? ParentID { get; set; }

        public virtual String FullName
        {
            get { return Title; }
        }
    }
}
