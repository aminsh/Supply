using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class PurchasingOfficer
    {
        public virtual Employee Employee { get; set; }
        public string Title { get; set; }
    }
}
