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
    public class Request : Entity
    {
        [Display(Name = "دوره")]
        [ForeignKey("PeriodID")]
        public virtual Period Period { get; set; }

        [Index("IX_No|PeriodId", true)] 
        public virtual Int32? PeriodID { get; set; }

        [Display(Name = "شماره سفارش خرید")]
        [Index("IX_No|PeriodId", true)] 
        public virtual Int32? OrderNo { get; set; }

        [Display(Name = "تاریخ درخواست")]
        [Required(ErrorMessage = "تاریخ درخواست الزامی است")]
        public virtual DateTime Date { get; set; }

        [Display(Name = "فوری است ؟")]
        public virtual Boolean IsFast { get; set; }

        [Display(Name = "وضعیت")]
        [Required(ErrorMessage = "وضعیت الزامی است")]
        public virtual RequestStatus Status { get; set; }

        [Display(Name = "درخواست کننده")]
        public virtual Person Person { get; set; }

        public virtual Int32? PersonID { get; set; }

        [Display(Name = "قسمت")]
        [ForeignKey("SectionID")]
        public virtual Section Section { get; set; }

        //[Required(ErrorMessage = "قسمت الزامی است")]
        // این قسمت موقتا برداشته میشود
        public virtual Int32? SectionID { get; set; }

        [Display(Name = "محل مصرف")]
        [ForeignKey("ConsumerSectionID")]
        public virtual Section ConsumerSection { get; set; }

        public virtual Int32? ConsumerSectionID { get; set; }

        [Display(Name = "تاریخ ثبت ")]
        [Required(ErrorMessage = " تاریخ ثبت الزامی است")]
        public virtual DateTime CreatedOnDate { get; set; }

        [Display(Name = "کاربر ثبت کننده ")]
        [ForeignKey("CreatedByUserID")]
        public virtual User CreatedByUser { get; set; }

        public virtual Int32 CreatedByUserID { get; set; }

        [Display(Name = "توضیحات")]
        public virtual String Des { get; set; }

        /// <summary>
        /// => 'False' یعنی ردیف هایی که درخواست اولیه نیستند و ممکن است فقط درخواست خرید باشد
        /// </summary>
        [Display(Name = "درخواست ؟")]
        public virtual Boolean HasRequest { get; set; }

        /// <summary>
        /// => 'False' یعنی درخواست هایی که هنوز سفارش خرید نشده اند
        /// </summary>
        [Display(Name = "سفارش خرید؟")]
        public virtual Boolean HasOrder { get; set; }

        [Display(Name = "تاریخ سفارش / تاریخ ارائه به کارپرداز")]
        public virtual DateTime? OrderDate { get; set; }

        [Display(Name = "کارپرداز")]
        [ForeignKey("PurchasingOfficerID")]
        public virtual PurchasingOfficer PurchasingOfficer { get; set; }

        public virtual Int32? PurchasingOfficerID { get; set; }

        [Display(Name = "روش خرید")]
        [Required(ErrorMessage = "روش خرید الزامی است")]
        public virtual PurchaseMethod PurchaseMethod { get; set; }

        [Display(Name = "دسته بندی سفارشی")]
        [ForeignKey("UserDefinedCategoryID")]
        public virtual UserDefinedCategory UserDefinedCategory { get; set; }

        public virtual Int32? UserDefinedCategoryID { get; set; }

        [Display(Name = "تایید مدیرعامل")]
        public virtual Boolean IsConfirmGeneralManager { get; set; }

        [Display(Name = "تایید فنی")]
        public virtual Boolean IsConfirmTech { get; set; }

        [Display(Name = "لغو شده ؟")]
        public virtual Boolean IsRejected { get; set; }

        //[NotMapped]
        //public virtual ICollection<RequestDetail> RequestDetails { get; set; }
    }

    

    public enum RequestStatus
    {
        [Display(Name = "صدور")]
        Created,
        [Display(Name = "تایید واحد سازمانی")]
        ConfirmSection,
        [Display(Name = "تایید توسط مدیریت تدارکات")]
        ConfirmManager,
        [Display(Name = "کارشناسی")]
        Expert,

        /// <summary>
        /// این بخش ممکن است برای درخواست کالا نباشد
        /// </summary>
        [Display(Name = "سفارش خرید")]
        Order,
        [Display(Name = "تحویل به کارپرداز")]
        PurchasingOfficer,
        [Display(Name = "خرید انجام شد")]
        OrderDone,

        /// <summary>
        /// این بخش فقط مخصوص کالا است
        /// </summary>
        [Display(Name = "رسید صادر شد")]
        InventoryInput,
        [Display(Name = "حواله صادر شد")]
        InventoryOutput,

        [Display(Name = "تحویل داده شد")]
        Delivered,
        [Display(Name = "لغو")]
        Cancel
    }


}
