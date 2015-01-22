using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Web.Security
{
    public class LoginUser
    {
        [Required(ErrorMessage = "نام کاربری الزامی میباشد")]
        [Display(Name = "نام کاربری")]
        public String UserName { get; set; }

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "کلمه عبور الزامی میباشد")]
        [Display(Name = "کلمه عبور")]
        public String Password { get; set; }

        [Display(Name = "منو یادت باشه ؟")]
        public Boolean RememberMe { get; set; }
    }
}