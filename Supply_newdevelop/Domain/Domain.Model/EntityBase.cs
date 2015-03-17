using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public interface IEntity
    {
        bool IsDeleted { get; set; }
    }
    public class EntityBase : IEntity
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
    }

    public static class EntityExtension
    {
        public static void SetDelete(this IEntity entity)
        {
            entity.IsDeleted = true;
        }
    }
}
