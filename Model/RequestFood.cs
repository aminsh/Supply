using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestFood : Request
    {
        public virtual ICollection<RequestDetailFood> RequestDetailFoods { get; set; }

        public virtual ICollection<EffectiveCostFood> EffectiveCostFoods { get; set; }

        public virtual ICollection<LetterRequestFood> LetterRequestFoods { get; set; }
    }
}
