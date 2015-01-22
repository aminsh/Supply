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
    public class BLRequestDetailService : BLBase<RequestDetailService>
    {
        public override void OnSubmitEntity(RequestDetailService entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
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


                        if (entity.NeedQty > 0  && entity.Qty < 1)
                        {
                            entity.AcceptQty = entity.NeedQty;
                            entity.Qty = entity.AcceptQty;
                        }
                    }
                    break;
                case EntityState.Modified:
                    {
                        var requestDetailGood =
                            Context.RequestDetailServices.IncludeX(rdg => rdg.RequestService)
                                   .IncludeX(rdg => rdg.RequestService.Period)
                                   .FirstOrDefault(rdg => rdg.ID == entity.ID);
                        var period = entity.RequestService.Period;
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

        private void SetPurchaseSize(RequestDetailService entity, Period period)
        {
            var middleAtleast = period.MiddleTransactionAtleast;
            var effectiveCostServiceDetails =
                Context.EffectiveCostServiceDetails.Include("CostType")
                       .Where(ecf => ecf.RequestDetailServiceID == entity.ID)
                       .ToList();

            double sumEffectiveCost = 0;

            if (entity.EffectiveCostServiceDetails != null)
            {
                if (entity.EffectiveCostServiceDetails.Any())
                {
                    entity.EffectiveCostServiceDetails.ForEach(e =>
                    {
                        if (e.CostType == null)
                            e.CostType = Context.CostTypes.FirstOrDefault(ct => ct.ID == e.CostTypeID);
                    });

                    sumEffectiveCost =
                        entity.EffectiveCostServiceDetails.Sum(
                            efc => efc.CostType.NatureCost == NatureCost.Positive ? efc.Cost : efc.Cost * -1);
                }
            }

            var total = entity.TotalPrice + sumEffectiveCost;
            entity.PurchaseSize = total >= middleAtleast ? PurchaseSize.Middle : PurchaseSize.Small;
        }
    }
}
