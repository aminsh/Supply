using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Model
{
    public class RequestVehicle : Request
    {
        public virtual ICollection<RequestDetailVehicle> RequestDetailVehicles { get; set; }

        public virtual ICollection<EffectiveCostVehicle> EffectiveCostVehicles { get; set; }

        public virtual ICollection<LetterRequestVehicle> LetterRequestVehicles { get; set; }
    }
}
