using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Attributes;

namespace Model
{
    public class RequestDetail : Entity
    {
        //[NotMapped]
        //public virtual Request Request { get; set; }

        [Display(Name = "ردیف")]
        public virtual Int32 Row { get; set; }

        [Display(Name = "لغو شده ؟")]
        public virtual Boolean IsCancel { get; set; }

        [Display(Name = "علت لغو")]
        public virtual String CancelReason { get; set; }

        [Display(Name = "اندازه خرید")]
        public virtual PurchaseSize PurchaseSize { get; set; }

        [Display(Name = "مقدار")]
        public virtual Double Qty { get; set; }

        [Display(Name = "توضیحات")]
        public virtual String Des { get; set; }

        [Display(Name = "تاریخ انجام ")]
        public virtual DateTime? DoneDate { get; set; }
        
        [ForeignKey("SellerID")]
        [Display(Name = "فروشنده")]
        public virtual Seller Seller { get; set; }
        
        public virtual Int32? SellerID { get; set; }
        
        [Display(Name = "تخمین مبلغ")]
        public virtual Double? EstimatePrice { get; set; }
        
        [Display(Name = "مبلغ واحد")]
        public virtual Double UnitPrice { get; set; }

        [Display(Name = "مبلغ کل")]
        public virtual Double? TotalPrice { get; set; }

        [Display(Name = "واحد")]
        [ForeignKey("ScaleID")]
        public virtual Scale Scale { get; set; }

        [Required(ErrorMessage = "واحد اندازه گیری الزامی است")]
        public virtual Int32 ScaleID { get; set; }

        /// <summary>
        /// این بخش توسط واحد متقاضی پر میشود
        /// </summary>
        #region Consumer
        [Display(Name = "شرح کالا / خدمات")]
        [Required(ErrorMessage = "شرح کالا / خدمات الزامی میباشد")]
        public virtual String ItemDescription { get; set; }

        [Display(Name = "مقدار مورد نیاز")]
        public virtual Double NeedQty { get; set; }

        [Display(Name = "مقدار قابل قبول")]
        public virtual Double AcceptQty { get; set; }

        [Display(Name = "مقدار قطعی")]
        public virtual Double ExactQty { get; set; }

        [Display(Name = "واحد")]
        public virtual String ScaleDescription { get; set; }
        #endregion

        [Display(Name = "ردیف جاری شامل سفارش است ؟")]
        public virtual Boolean IsOrder { get; set; }

    }
}
