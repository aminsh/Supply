using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Input : Inventory
    {
        [Display(Name = "نوع رسید")]
        public virtual InputType InputType { get; set; }

        public virtual ICollection<InputDetail> InputDetails { get; set; }
    }

    public enum InputType
    {
        [Display(Name = "خرید")]
        Purchase,
        [Display(Name = "برگشت به انبار")]
        ReturnToStock
    }
}
