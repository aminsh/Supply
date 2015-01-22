using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace BussinessLogic
{
    public class BLInputDetail : BLBase<InputDetail>
    {
        public override void OnSubmitEntity(InputDetail entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            switch (state)
            {
                case EntityState.Added:
                    {
                       
                    }
                    break;
                case EntityState.Modified:
                    {

                    }
                    break;
                case EntityState.Deleted:
                    {

                    }
                    break;
            }

            base.OnSubmitEntity(entity, state, originalValues);
        }
    }
}
