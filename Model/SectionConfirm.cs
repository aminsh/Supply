using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class SectionConfirm : Entity
    {
        [Display(Name = "قسمت")]
        [ForeignKey("SectionID")]
        public virtual Section Section { get; set; }

        [Required(ErrorMessage = "قسمت الزامی است")]
        public virtual Int32? SectionID { get; set; }

        [Display(Name = "کاربر تایید کننده")]
        [ForeignKey("UserID")]
        public virtual User User { get; set; }

        [Required(ErrorMessage = "کاربر الزامی است")]
        public virtual Int32 UserID { get; set; }

        [Display(Name = "ترتیب الویت")]
        public virtual Int32 OrderValue { get; set; }
    }
}
