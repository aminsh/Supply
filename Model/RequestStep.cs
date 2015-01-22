using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestStep : Entity
    {
        [Display(Name = "درخواست")]
        [ForeignKey("RequestID")]
        public virtual Request Request { get; set; }

        [Required(ErrorMessage = "درخواست الزامی است")]
        public virtual Int32 RequestID { get; set; }

        [Display(Name = "مرحله")]
        [ForeignKey("StepID")]
        public virtual RequestDefineStep Step { get; set; }

        [Required(ErrorMessage = "مرحله الزامی است")]
        public virtual Int32 StepID { get; set; }

        [Display(Name = "ایجاد شده در تاریخ")]
        public virtual DateTime CreatedOnDate { get; set; }
        
        [Display(Name = "تایید شده در تاریخ")]
        public virtual DateTime? DoneOnDate { get; set; }

        [ForeignKey("HandlerUserID")]
        [Display(Name = "رسیدگی کننده")]
        public virtual User HandlerUser { get; set; }

        public virtual Int32? HandlerUserID { get; set; }

        [Display(Name = "وضعیت انجام")]
        public virtual StepStatus Status { get; set; }
    }

    public enum StepStatus
    {
        [Display(Name = "انجام شده")] 
        Done,
        [Display(Name = "در حال انجام")] 
        InProgress,
        [Display(Name = "جدید")] 
        New,
        [Display(Name = "مردود")]
        Rejected
    }
    
    public class RequestDefineStep : EntityType
    {
        [Display(Name = "ترتیب")]
        public virtual Int32 Ordering { get; set; }

        // this prop is for system
        public virtual String Name { get; set; }

        public virtual Boolean IsActive { get; set; }

        /// <summary>
        /// فقط یک کاربر میتواند به این وظیفه رسیدگی کند
        /// </summary>
        [Display(Name = "کاربران رسیدگی کننده")]
        public virtual ICollection<RequestDefineStepUser> HandlerUsers { get; set; }

        /// <summary>
        /// این بخش فعلا جهت فیلترکردن جزئیات - جدا کردن - جزئیات درخواست خرید و درخواست کالا میباشد
        /// </summary>
        [Display(Name = "فرآیند خرید است ؟")]
        public virtual Boolean IsOrder { get; set; }

        /// <summary>
        /// (True) حتما باید انجام شود
        /// (False) رسیدگی در هر مرحله در صورت نیاز میتواند ارجاع بزند
        /// </summary>
        [Display(Name = "اجباری ؟")]
        public virtual Boolean IsRequired { get; set; }

        public virtual ICollection<RequestTypeInRequestDefineStep> RequestTypeInRequestDefineSteps { get; set; }

        public virtual String RequestTypes { get; set; }

        public virtual String ViewName { get; set; }

        public RequestDefineType RequestDefineType { get; set; }
    }

    public enum RequestDefineType
    {
        Approval,
        FirstExpert,
        OrderExpert,
        ExpertGood,
        PurchasingOfficer,
        Closed
    }

    public class RequestDefineStepUser : Entity
    {
        [ForeignKey("UserID")]
        public virtual User User { get; set; }

        public virtual Int32 UserID { get; set; }

        [ForeignKey("RequestDefineStepID")]
        public virtual RequestDefineStep RequestDefineStep { get; set; }

        public virtual Int32 RequestDefineStepID { get; set; }
    }

    public class RequestTypeInRequestDefineStep : Entity
    {
        [ForeignKey("RequestDefineStepID")]
        public virtual RequestDefineStep RequestDefineStep { get; set; }

        public virtual Int32 RequestDefineStepID { get; set; }

        public virtual RequestType RequestType { get; set; }
    }
}
