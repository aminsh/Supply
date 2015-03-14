﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class OrderGood : EntityBase
    {
        public DateTime Date { get; set; }
        public virtual ICollection<OrderGoodDetail> Details { get; set; }
    }
}
