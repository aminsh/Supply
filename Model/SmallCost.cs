using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class SmallCost : Entity
    {
        [Required(ErrorMessage = "شرح الزامی است")]
        public virtual String Des { get; set; }

        public virtual Double Cost { get; set; }
    }
                 
    public class SmallCostServiceDetail : SmallCost
    {
        [ForeignKey("RequestDetailServiceID")]
        public virtual RequestDetailService RequestDetailService { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestDetailServiceID { get; set; }
    }

    public class  SmallCostVehicleDetail : SmallCost
    {
        [ForeignKey("RequestDetailVehicleID")]
        public virtual RequestDetailVehicle RequestDetailVehicle { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestDetailVehicleID { get; set; }
    }
}
