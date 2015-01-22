using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace BussinessLogic.RequestReview
{
    public class RequestX
    {
        public Section Section { get; set; }

        public Item Item { get; set; }

        public Seller Seller { get; set; }

        public PurchasingOfficer PurchasingOfficer { get; set; }

        public Double? Total { get; set; }

        public Double? Qty { get; set; }

        public Driver Driver { get; set; }

        public Vehicle Vehicle { get; set; }
    }
}
