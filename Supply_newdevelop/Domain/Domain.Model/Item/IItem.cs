using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public interface IItem
    {
        string Title { get; set; }
        string Des { get; set; }
        double Price { get; set; }
    }
}
