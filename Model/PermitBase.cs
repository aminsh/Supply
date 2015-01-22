using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class PermitBase : Entity
    {
        [ForeignKey("SubjectID")]
        public virtual Subject Subject { get; set; }

        [Required(ErrorMessage = "موضوع الزامی میباشد")]
        public virtual Int32 SubjectID { get; set; }

        [Display(Name = "ببیند ؟")]
        public virtual Boolean CanRead { get; set; }

        [Display(Name = "ویرایش کند ؟")]
        public virtual Boolean CanEdit { get; set; }

        [Display(Name = "حذف کند ؟")]
        public virtual Boolean CanDelete { get; set; }
    }

   public class UserPermit : PermitBase
   {
       [ForeignKey("UserID")]
       public virtual User User { get; set; }

       [Required(ErrorMessage = "کاربر الزامی میباشد")]
       public virtual Int32 UserID { get; set; }
   }

   public class RolePermit : PermitBase
   {
       [ForeignKey("RoleID")]
       public virtual Role Role { get; set; }

       [Required(ErrorMessage = "نقش الزامی میباشد")]
       public virtual Int32 RoleID { get; set; }
   }
}
