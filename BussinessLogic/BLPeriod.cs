using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace BussinessLogic
{
    public class BLPeriod : BLBase<Period>
    {
        public override void OnSubmitEntity(Period entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            if (originalValues.Any())
            {
                if (!originalValues.FirstOrDefault(ov => ov.Key == "IsActive").Value.Cast<Boolean>() && entity.IsActive)
                {
                    var periods = Context.Periods.Where(p => p.ID != entity.ID).ToList();
                    periods.ForEach(p=> p.IsActive = false);
                }
            }

            base.OnSubmitEntity(entity, state, originalValues);
        }
    }
}
