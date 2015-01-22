using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestSubmitBatch : Entity
    {
        [Display(Name = "شرح")]
        public virtual String Title { get; set; }

        [Display(Name = "وضعیت")]
        public virtual RequestSubmitBatchStatus Status { get; set; }

        [Display(Name = "شماره ارجاع مالی")]
        public virtual Int32? AccReferenceID { get; set; }

        public virtual ICollection<RequestDetailInBatch> RequestDetailInBatches { get; set; }
    }

    public enum RequestSubmitBatchStatus
    {
        [Display(Name = "ایجاد شده")]
        Created,
        [Display(Name = "به مالی شده ارسال شده")]
        Pending,
        [Display(Name = "تایید",
            Description = "در این حالت سند حسابداری صادر شده")]
        Confirm
    }

    public class RequestDetailInBatch : Entity
    {
        [ForeignKey("RequestDetailID")]
        public virtual RequestDetail RequestDetail { get; set; }

        public virtual Int32 RequestDetailID { get; set; }
    }
}
