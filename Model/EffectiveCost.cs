using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class EffectiveCost : Entity
    {
        [ForeignKey("CostTypeID")]
        [Display(Name = "نوع هزینه")]
        public virtual CostType CostType { get; set; }

        [Display(Name = "CostTypeID")]
        [Required(ErrorMessage = "نوع هزینه الزامی میباشد")]
        public virtual Int32 CostTypeID { get; set; }

        [Display(Name = "هزینه")]
        public virtual Double Cost { get; set; }
    }
}
