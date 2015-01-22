using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Output : Inventory
    {
        [Display(Name = "نوع حواله")]
        public virtual OutputType OutputType { get; set; }

        public virtual ICollection<OutputDetail> OutputDetails { get; set; }
    }

    public enum OutputType
    {
        [Display(Name = "حواله")]
        Output,
        [Display(Name = "انبار به انبار")]
        StockToStock,

        // متاسفانه برای واژه جمعداری واژه معادل انگلیسی پیدار نکردم
        [Display(Name = "جمعداری")]
        Jamdary
    }
}
