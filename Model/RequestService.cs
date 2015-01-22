using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestService : Request
    {
        public virtual ICollection<RequestDetailService> RequestDetailServices { get; set; }

        public virtual ICollection<EffectiveCostService> EffectiveCostServices { get; set; }

        public virtual ICollection<LetterRequestService> LetterRequestServices { get; set; }
        
    }
}
