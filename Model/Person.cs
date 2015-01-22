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
    public class Person : Entity
    {
        [Display(Name = "کد پرسنلی")]
        public virtual Int32? Code { get; set; }

        [Required(ErrorMessage = "نام الزامی است")]
        public virtual String FirstName { get; set; }

        [Required(ErrorMessage = "نام خانوادگی الزامی است")]
        public virtual String LastName { get; set; }

        public virtual String FullName
        { get { return FirstName + " " + LastName; } }        
    }

    public class Employee : Person
    {
        [Display(Name = "پست سازمانی")]
        [Required(ErrorMessage = "پست سازمانی اجباری میباشد")]
        public virtual String Position { get; set; }

        [Display(Name = "واحد سازمانی")]
        public virtual String Unit { get; set; }

        [Display(Name = "قسمت")]
        [ForeignKey("SectionID")]
        public virtual Section Section { get; set; }

        [Required(ErrorMessage = "قسمت الزامی است")]
        public virtual Int32 SectionID { get; set; }
    }

    public class Everyone : Person
    {
        [Display(Name = "محل")]
        [Required(ErrorMessage = "محل الزامی است")]
        public virtual String Location { get; set; }

        [Display(Name = "توضیحات")]
        public virtual String Des { get; set; }
    }
}
