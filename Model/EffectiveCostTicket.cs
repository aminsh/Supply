using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class EffectiveCostTicket : EffectiveCost
    {
        [ForeignKey("RequestTicketID")]
        public virtual RequestTicket RequestTicket { get; set; }

        public virtual Int32 RequestTicketID { get; set; }
    }

    public class EffectiveCostTicketDetail : EffectiveCost
    {
        [ForeignKey("RequestDetailTicketID")]
        public virtual RequestDetailTicket RequestDetailTicket { get; set; }

        public virtual Int32 RequestDetailTicketID { get; set; }
    }
}
