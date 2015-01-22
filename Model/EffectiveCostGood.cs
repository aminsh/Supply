using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class EffectiveCostGood : EffectiveCost
    {
        [ForeignKey("RequestGoodID")]
        public virtual RequestGood RequestGood { get; set; }

        public virtual Int32 RequestGoodID { get; set; }
    }


    public class EffectiveCostGoodDetail : EffectiveCost
    {
        [ForeignKey("RequestDetailGoodID")]
        public virtual RequestDetailGood RequestDetailGood { get; set; }

        public virtual Int32 RequestDetailGoodID { get; set; }
    }
}
