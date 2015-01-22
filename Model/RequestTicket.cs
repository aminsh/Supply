using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestTicket : Request
    {
        public virtual ICollection<RequestDetailTicket> RequestDetailTickets { get; set; }

        public virtual ICollection<EffectiveCostTicket> EffectiveCostTickets { get; set; }

        public virtual ICollection<LetterRequestTicket> LetterRequestTickets { get; set; }
    }
}
