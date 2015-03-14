using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class User : EntityBase
    {
        public virtual Person Person { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
