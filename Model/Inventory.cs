using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Attributes;

namespace Model
{
    public class Inventory : Entity
    {
        //[Display(Name = "درخواست واحد متقاضی")]
        //[ForeignKey("ConsumerSectionRequestID")]
        //public virtual ConsumerSectionRequest ConsumerSectionRequest { get; set; }

        //public virtual Int32 ConsumerSectionRequestID { get; set; }

        [Display(Name = "شماره")]
        //[Index("IX_No|PeriodId", true)]
        public virtual Int32? No { get; set; }

        [Display(Name = "تاریخ")]
        [Required(ErrorMessage = "تاریخ الزامی است")]
        public virtual DateTime Date { get; set; }

        [Display(Name = "دوره")]
        [ForeignKey("PeriodID")]
        public virtual Period Period { get; set; }

        public virtual Int32? PeriodID { get; set; }

        [Display(Name = "قسمت")]
        [ForeignKey("SectionID")]
        public virtual Section Section { get; set; }

        [Required(ErrorMessage = "قسمت الزامی است")]
        public virtual Int32 SectionID { get; set; }

        [Display(Name = "تحویل گیرنده/ دهنده")]
        public virtual Person Person { get; set; }
        
        [Required(ErrorMessage = "تحویل گیرنده / دهنده الزامی است")]
        public virtual Int32 PersonID { get; set; }

        [Display(Name = "انبار")]
        [ForeignKey("StockID")]
        public virtual Stock Stock { get; set; }

        [Required(ErrorMessage = "انبار الزامی است")]
        public virtual Int32 StockID { get; set; }

        [Display(Name = "وضعیت")]
        public virtual InventoryStatus Status { get; set; }

        [Display(Name = "توضیحات")]
        public virtual String Des { get; set; }

        [Display(Name = "تاریخ ثبت ")]
        [Required(ErrorMessage = " تاریخ ثبت الزامی است")]
        public virtual DateTime CreatedOnDate { get; set; }

        [Display(Name = "کاربر ثبت کننده ")]
        [ForeignKey("CreatedByUserID")]
        public virtual User CreatedByUser { get; set; }

        public virtual Int32 CreatedByUserID { get; set; }

        [Display(Name = "سفارش خرید")]
        [ForeignKey("RequestGoodID")]
        public virtual RequestGood RequestGood { get; set; }

        public virtual Int32? RequestGoodID { get; set; }
    }

    public enum InventoryStatus
    {
        [Display(Name = "موقت")]
        Temporary,
        [Display(Name = "تایید")]
        Confirm,
        [Display(Name = "ثبت قطعی")]
        Fixed,
    }
}
