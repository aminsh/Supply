using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Model;

namespace Web.Security
{
    public class RegisterUser : User
    {
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "تایید کلمه عبور الزامی میباشد")]
        [Display(Name = "تایید کلمه عبور")]
        [Compare("Password", ErrorMessage = "کلمه عبور و تایید کلمه عبور باید یکسان باشد")]
        public String ConfirmPassword { get; set; }
    }
}