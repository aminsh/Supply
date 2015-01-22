using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    
    public class Role : Entity
    {
        [Display(Name = "نام")]
        [Required(ErrorMessage = "نام الزامی میباشد")]
        [StringLength(20, ErrorMessage = "نام باید بین 3 تا 20 کاراکتر باشد", MinimumLength = 3)]
        public virtual String Name { get; set; }

        [Display(Name = "عنوان")]
        [Required(ErrorMessage = "عنوان الزامی میباشد")]
        [StringLength(20, ErrorMessage = "عنوان باید بین 3 تا 20 کاراکتر باشد", MinimumLength = 3)]
        public virtual String Title { get; set; }

        [Display(Name = "انواع گروه کاربری")]
        public virtual RoleType RoleType { get; set; }

        public virtual ICollection<UserInRole> UserInRoles { get; set; }
        public virtual ICollection<RolePermit> RolePermits { get; set; }
    }

    public enum RoleType
    {
        [Display(Name = "سیستمی")]
        System,
        [Display(Name = "معمولی")]
        Normal
    }
}
