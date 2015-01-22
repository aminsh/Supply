using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestDetailVehicle : RequestDetail
    {
        [Display(Name = "درخواست")]
        [ForeignKey("RequestVehicleID")]
        public virtual RequestVehicle RequestVehicle { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestVehicleID { get; set; }

        [Display(Name = "وسیله نقلیه")]
        [ForeignKey("VehicleID")]
        public virtual Vehicle Vehicle { get; set; }

        public virtual Int32 VehicleID { get; set; }

        [Display(Name = "راننده")]
        [ForeignKey("DriverID")]
        public virtual Driver Driver { get; set; }

        public virtual Int32? DriverID { get; set; }

        [Display(Name = "کالا")]
        [ForeignKey("ItemVehicleID")]
        public virtual ItemVehicle ItemVehicle { get; set; }

        [Required(ErrorMessage = "کالا الزامی است")]
        public virtual Int32 ItemVehicleID { get; set; }


        public virtual ICollection<EffectiveCostVehicleDetail> EffectiveCostVehicleDetails { get; set; }

        public virtual ICollection<SmallCostVehicleDetail> SmallCostVehicleDetails { get; set; }
    }
}
