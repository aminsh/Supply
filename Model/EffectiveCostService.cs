using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class EffectiveCostService : EffectiveCost
    {
        [ForeignKey("RequestServiceID")]
        public virtual RequestService RequestService { get; set; }

        public virtual Int32 RequestServiceID { get; set; }
    }

    public class EffectiveCostServiceDetail : EffectiveCost
    {
        [ForeignKey("RequestDetailServiceID")]
        public virtual RequestDetailService RequestDetailService { get; set; }

        public virtual Int32 RequestDetailServiceID { get; set; }

    }
}
