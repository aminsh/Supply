using System;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class Entity
    {
        [Display(Name = "شناسه", Order = 1)]
        [Key]
        public virtual Int32 ID { get; set; }

        [Display(AutoGenerateField = false)]
        [ConcurrencyCheck]
        [Timestamp]
        public virtual Byte[] EntityToken { get; set; }
    }
}
