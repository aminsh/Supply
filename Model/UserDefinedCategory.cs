using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class UserDefinedCategory : Entity
    {
        [Display(Name = "شرح کوتاه")]
        [StringLength(255, MinimumLength = 3, ErrorMessage = "عنوان باید مابین 3 تا 255 کاراکتر باشد")]
        public virtual String Title { get; set; }
        
        [Display(Name = "شرح بلند")]
        public virtual String Des { get; set; }
    }
}
