using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Model
{
    [DisplayColumn("No,Title")]
    public class Vehicle : EntityBasic
    {
        [Display(Name = "راننده")]
        [ForeignKey("DriverID")]
        public virtual Driver Driver { get; set; }

        [Required(ErrorMessage = "راننده الزامی است")]
        public virtual Int32 DriverID { get; set; }

        [Display(Name = "نوع خودرو")]
        [ForeignKey("VehicleTypeID")]
        public virtual VehicleType VehicleType { get; set; }

        [Required(ErrorMessage = "نوع خودرو الزامی است")]
        public virtual Int32 VehicleTypeID { get; set; }
    }
}
