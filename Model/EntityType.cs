using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class EntityType : Entity
    {
        [Required(ErrorMessage = "عنوان الزامی میباشد")]
        [StringLength(255,MinimumLength = 3,ErrorMessage = "طول عنوان باید مابین 3 تا 50 کاراکتر باشد")]
        [Display(Name = "عنوان")]
        public virtual String Title { get; set; }

        [Display(Name = "Full name",
            AutoGenerateField = false)]
        public virtual String FullName
        {
            get { return Title; }
        }

        [Display(Name = "Short name",AutoGenerateField = false)]
        public virtual String ShortName
        {
            get { return Title; }
        }
    }
}
