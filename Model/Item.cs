using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Attributes;

namespace Model
{
    public class Item : Entity
    {
        [Required(ErrorMessage = "عنوان الزامی میباشد")]
        [StringLength(255, MinimumLength = 3, ErrorMessage = "عنوان باید مابین 3 تا 255 کاراکتر باشد")]
        [Display(Name = "عنوان", Order = 3)]
        public virtual String Title { get; set; }

        [Display(Name = "قیمت پیش فرض")]
        [Filterable]
        public virtual Double? Price { get; set; }

        [Display(Name = "واحد")]
        public virtual Scale Scale { get; set; }

        [Required(ErrorMessage = "واحد الزامی است")]
        public virtual Int32 ScaleID { get; set; }

        [Display(Name = "توضیحات")]
        public virtual String Des { get; set; }

    }
}
