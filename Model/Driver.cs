using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Attributes;

namespace Model
{
    [DisplayColumn("Title")]
    public class Driver : EntityType
    {
        [Display(Name = "Vehicles")]
        public virtual IQueryable<Vehicle> Vehicles { get; set; }
    }
}
