﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Order
{
    public class CostDetail : EntityBase
    {
        public string Des { get; set; }
        public double Cost { get; set; }
    }
}
