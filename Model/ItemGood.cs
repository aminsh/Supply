using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    [DisplayColumn("No,Title")]
    public class ItemGood : Item
    {
        [Required(ErrorMessage = "کد الزامی میباشد")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "کد باید مابین 3 تا 50 کاراکتر باشد")]
        [Display(Name = "کد", Order = 2)]
        public virtual String No { get; set; }

        public virtual String FullName
        {
            get { return No + " " + Title; }
        }

        [Display(Name = "گروه")]
        [ForeignKey("ParentID")]
        public virtual ItemGood Parent { get; set; }

        [Display(Name = "ParentID")]
        public virtual Int32? ParentID { get; set; }

        //public ICollection<Item> Children { get; set; }

        public virtual String FullPathID { get; set; }

        public virtual String FullPathText { get; set; }

        [Display(Name = "شرح فنی")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "شرح فنی باید مابین 3 تا 50 کاراکتر باشد")]
        public virtual String TechnicalTitle { get; set; }

        [Display(Name = "محل استقرار")]
        public virtual String Location { get; set; }

        [Display(Name = "نقطه سفارش")]
        public virtual Double ReorderPoint { get; set; }

        public virtual ICollection<ItemGoodInStock> ItemGoodInStocks { get; set; }
    }
}
