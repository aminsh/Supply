using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class DefaultSetting : Entity
    {
        [Display(Name = "حداقل مبلغ سامانه دولت")]
        public virtual Double GovermentSystemAmount { get; set; }

        [Display(Name = "نرخ مالیات بر ارزش افزوده")]
        public virtual Double VATPercent { get; set; }

        [Display(Name = "عوارض")]
        public virtual Double TaxPercent { get; set; }

        [Display(Name = "مالیات و عوارض")]
        public virtual Double Tax { get { return VATPercent + TaxPercent; } }
    }
}
