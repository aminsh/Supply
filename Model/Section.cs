using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Model
{
    [DisplayColumn("Title")]
    public class Section : EntityType
    {
        [Display(Name = "گروه")]
        [ForeignKey("SectionID")]
        public virtual Section Parent { get; set; }

        public virtual Int32? SectionID { get; set; }

        public virtual ICollection<Section> Children { get; set; }
               
        public virtual String FullPathID { get; set; }

        public virtual String FullPathText { get; set; }

        public virtual ICollection<SectionConfirm> SectionConfirms { get; set; }

    }
}
