using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
using Model;

namespace BussinessLogic
{
    public class BLRequestDetailVehicle : BLBase<RequestDetailVehicle>
    {
        public override void OnSubmitEntity(RequestDetailVehicle entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            entity.TotalPrice = entity.UnitPrice*entity.Qty;

            switch (state)
            {
                case EntityState.Added:
                    {
                        var period = Context.Periods.FirstOrDefault(p => p.IsActive);
                        if (period == null)
                            throw new NullReferenceException("دوره ای تنظیم نشده یا دوره فعال وجود ندارد");
                        SetPurchaseSize(entity, period);
                    }
                    break;
                case EntityState.Modified:
                    {
                        var requestDetailGood =
                            Context.RequestDetailVehicles.IncludeX(rdg => rdg.RequestVehicle)
                                   .IncludeX(rdg => rdg.RequestVehicle.Period)
                                   .FirstOrDefault(rdg => rdg.ID == entity.ID);
                        var period = entity.RequestVehicle.Period;
                        if (period == null)
                            throw new NullReferenceException("دوره ای تنظیم نشده ");
                        SetPurchaseSize(entity, period);
                    }
                    break;
                case EntityState.Deleted:
                    {

                    }
                    break;
            }

            base.OnSubmitEntity(entity, state, originalValues);

        }

        private void SetPurchaseSize(RequestDetailVehicle entity, Period period)
        {
            var middleAtleast = period.MiddleTransactionAtleast;
            var effectiveCostVehicleDetails =
                Context.EffectiveCostVehicleDetails.Include("CostType")
                       .Where(ecf => ecf.RequestDetailVehicleID == entity.ID)
                       .ToList();

            double sumEffectiveCost = 0;

            if (entity.EffectiveCostVehicleDetails != null)
            {
                if (entity.EffectiveCostVehicleDetails.Any())
                {
                    entity.EffectiveCostVehicleDetails.ForEach(e =>
                    {
                        if (e.CostType == null)
                            e.CostType = Context.CostTypes.FirstOrDefault(ct => ct.ID == e.CostTypeID);
                    });

                    sumEffectiveCost =
                        entity.EffectiveCostVehicleDetails.Sum(
                            efc => efc.CostType.NatureCost == NatureCost.Positive ? efc.Cost : efc.Cost * -1);
                }
            }

            var total = entity.TotalPrice + sumEffectiveCost;
            entity.PurchaseSize = total >= middleAtleast ? PurchaseSize.Middle : PurchaseSize.Small;
        }
    }
}
