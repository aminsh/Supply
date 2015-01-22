using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    [DisplayColumn("DateForm,DateTo")]
    public class Period : Entity
    {
        [Display(Name = "تاریخ شروع")]
        public virtual DateTime DateFrom { get; set; }

        [Display(Name = "تاریخ پایان")]
        public virtual DateTime DateTo { get; set; }

        [Display(Name = "حداقل مبلغ معاملات متوسط")]
        public virtual Double MiddleTransactionAtleast { get; set; }

        [Display(Name = "نرخ مالیات بر ارزش افزوده")]
        public virtual Double VATPercent { get; set; }

        [Display(Name = "عوارض")]
        public virtual Double TaxPercent { get; set; }

        [Display(Name = "فعال است ؟")]
        public virtual Boolean IsActive { get; set; }
    }
}
