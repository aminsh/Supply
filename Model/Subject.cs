using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Subject : Entity
    {
        [Display(Name = "نام")]
        [Required(ErrorMessage = "نام الزامی میباشد")]
        [StringLength(50, ErrorMessage = "نام باید بین 3 تا 50 کاراکتر باشد", MinimumLength = 3)]
        public virtual String Name { get; set; }

        [Display(Name = "عنوان")]
        [Required(ErrorMessage = "عنوان الزامی میباشد")]
        [StringLength(50, ErrorMessage = "عنوان باید بین 3 تا 50 کاراکتر باشد", MinimumLength = 3)]
        public virtual String Title { get; set; }

        [Display(Name = "نیاز به کنترل دسترسی نیست ")]
        public virtual Boolean NoNeed { get; set; }

        [Display(Name = "برای کاربران معمولی نمایش داده شود")]
        public virtual Boolean CanShow { get; set; }
    }
}
