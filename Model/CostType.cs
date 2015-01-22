using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class CostType : EntityType
    {
        [Display(Name = "ماهیت")]
        [Required(ErrorMessage = "ماهیت الزامی است")]
        public virtual NatureCost NatureCost { get; set; }
    }
}
