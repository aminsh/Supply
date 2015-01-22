using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace BussinessLogic
{
    public class BLRequestDefineStep : BLBase<RequestDefineStep>
    {
        public override void OnSubmitEntity(RequestDefineStep entity, EntityState state, Dictionary<string, object> originalValues)
        {
            entity.ViewName = entity.RequestDefineType.ToString();
            base.OnSubmitEntity(entity, state, originalValues);
        }
    }
}
