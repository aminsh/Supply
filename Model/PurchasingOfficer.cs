using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class PurchasingOfficer : Entity
    {
        [ForeignKey("EmployeeID")]
        [Display(Name = "پرسنل")]
        public virtual Employee Employee { get; set; }

        [Required(ErrorMessage = "پرسنل الزامی است")]
        public virtual Int32 EmployeeID { get; set; }

        [Display(Name = "عنوان")]
        public virtual String Title { get; set; }
    }
}
