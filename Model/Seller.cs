using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    [DisplayColumn("Title")]
    public class Seller : Entity
    {
        [Required(ErrorMessage = "عنوان الزامی میباشد")]
        [StringLength(255, MinimumLength = 3, ErrorMessage = "عنوان باید مابین 3 تا 255 کاراکتر باشد")]
        [Display(Name = "عنوان", Order = 3)]
        public virtual String Title { get; set; }

        public virtual String Phone { get; set; }

        public virtual String Mobile { get; set; }

        public virtual String Fax { get; set; }

        public virtual String Email { get; set; }

        public virtual String Address { get; set; }

        [StringLength(255, MinimumLength = 3, ErrorMessage = "کد باید مابین 3 تا 255 کاراکتر باشد")]
        [Display(Name = "کد اقتصادی", Order = 3)]
        public virtual String EconomicIssue { get; set; }

    }
}
