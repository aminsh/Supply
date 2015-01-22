using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class OutputDetail : InventoryDetail
    {
        [ForeignKey("OutputID")]
        public virtual Output Output { get; set; }

        public virtual Int32 OutputID { get; set; }
    }
}
