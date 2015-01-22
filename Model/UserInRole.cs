using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class UserInRole : Entity
    {
        [ForeignKey("RoleID")]
        public virtual Role Role { get; set; }

        public virtual Int32 RoleID { get; set; }

        [ForeignKey("UserID")]
        public virtual User User { get; set; }

        public virtual Int32 UserID { get; set; }
    }
}
