using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Model;

namespace BussinessLogic
{
    public class BLOutputDetail : BLBase<OutputDetail>
    {
        public override void OnSubmitEntity(OutputDetail entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            switch (state)
            {
                case EntityState.Added:
                    {
                        var periodId = 0;

                        if (entity.Output != null)
                            if(entity.Output.PeriodID != null)
                                periodId = entity.Output.PeriodID.Convert<int>();
                        if (periodId == 0)
                        {
                            var period = Context.Periods.FirstOrDefault(p => p.IsActive);
                            if (period == null)
                                throw new NullReferenceException("دوره ای تنظیم نشده یا دوره فعال وجود ندارد");

                            periodId = period.ID;
                        }

                        //don`t forget stock for this condition
                        double inputQty = 0;
                        if (Context.InputDetails.Any(
                            id => 
                                id.Input.PeriodID == periodId && id.ItemGoodID == entity.ItemGoodID))
                        {
                            inputQty = Context.InputDetails.Where(
                                id => 
                                id.Input.PeriodID == periodId && id.ItemGoodID == entity.ItemGoodID)
                                              .Sum(id => id.Qty);
                        }
                        double outputQty = 0;
                        if (Context.OutputDetails.Any(
                                od => od.Output.PeriodID == periodId && od.ItemGoodID == entity.ItemGoodID))
                        {
                            outputQty =
                                Context.OutputDetails.Where(
                                    od => od.Output.PeriodID == periodId && od.ItemGoodID == entity.ItemGoodID)
                                       .Sum(od => od.Qty);
                        }

                        var rem = inputQty - outputQty;

                        if(entity.Qty > rem)
                            throw new ValidationExceptionX(string.Format("موجودی کالای جاری {0} میباشد" , rem),null)
                                {
                                    EntityInError = entity,
                                    BadProp = "Qty"
                                };

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
