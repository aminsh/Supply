using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class EffectiveCostFood : EffectiveCost
    {
        [ForeignKey("RequestFoodID")]
        public virtual RequestFood RequestFood { get; set; }

        public virtual Int32 RequestFoodID { get; set; }
    }

    public class EffectiveCostFoodDetail : EffectiveCost
    {
        [ForeignKey("RequestDetailFoodID")]
        public virtual RequestDetailFood RequestDetailFood { get; set; }

        public virtual Int32 RequestDetailFoodID { get; set; }

    }
}
