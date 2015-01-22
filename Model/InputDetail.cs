using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class InputDetail : InventoryDetail
    {
        [ForeignKey("InputID")]
        public virtual Input Input { get; set; }

        public virtual Int32 InputID { get; set; }
    }
}
