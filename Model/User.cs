using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    [DisplayColumn("FirstName,LastName")]
    public class User : Entity
    {
        [Display(Name = "نام")]
        [Required(ErrorMessage = "نام الزامی است")]
        [StringLength(50,ErrorMessage = "نام باید بین 3 تا 50 کاراکتر باشد",MinimumLength = 3)]
        public virtual String FirstName { get; set; }

        [Display(Name = "نام خانوادگی")]
        [Required(ErrorMessage = "نام خانوادگی الزامی است")]
        [StringLength(50, ErrorMessage = "نام خانوادگی باید بین 3 تا 50 کاراکتر باشد", MinimumLength = 3)]
        public virtual String LastName { get; set; }

        [Display(Name = "نام کاربری")]
        [Required(ErrorMessage = "نام کاربری الزامی است")]
        [StringLength(50, ErrorMessage = "نام کاربری باید بین 3 تا 50 کاراکتر باشد", MinimumLength = 3)]
        public virtual String Username { get; set; }

        [Display(Name = "کلمه عبور")]
        [Required(ErrorMessage = "کلمه عبور الزامی است")]
        
        [DataType(DataType.Password)]
        public virtual String Password { get; set; }

        [Display(Name = "ایمیل")]
        public virtual String Email { get; set; }

        [Display(Name = "تلفن")]
        public virtual String Phone { get; set; }

        [Display(Name = "آدرس")]
        public virtual String Address { get; set; }

        public virtual String ImageUrl { get; set; }

        public virtual String FullName { get { return FirstName + " " + LastName; } }

        [ForeignKey("EmployeeID")]
        public virtual Employee Employee { get; set; }

        public virtual Int32? EmployeeID { get; set; }

    }
}
