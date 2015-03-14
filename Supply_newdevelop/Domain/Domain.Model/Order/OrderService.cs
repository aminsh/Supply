using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Model.Order;

namespace Domain.Model
{
    public class OrderService : EntityBase
    {
        public DateTime Date { get; set; }
        public virtual ICollection<OrderServiceDetail> Details { get; set; }
        public virtual ICollection<Letter> Letters { get; set; }    
    }
}
