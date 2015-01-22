using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class EffectiveCostVehicle : EffectiveCost
    {
        [ForeignKey("RequestVehicleID")]
        public virtual RequestVehicle RequestVehicle { get; set; }

        public virtual Int32 RequestVehicleID { get; set; }
    }

    public class EffectiveCostVehicleDetail : EffectiveCost
    {
        [ForeignKey("RequestDetailVehicleID")]
        public virtual RequestDetailVehicle RequestDetailVehicle { get; set; }

        public virtual Int32 RequestDetailVehicleID { get; set; }
    }
}
