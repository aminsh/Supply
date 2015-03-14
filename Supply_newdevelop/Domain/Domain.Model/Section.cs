using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class Section 
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public ICollection<Section> Children { get; set; }
    }
}
