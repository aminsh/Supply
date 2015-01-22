using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DataAccess;

namespace BussinessLogic
{
    public class BLRequestDetailGood : BLBase<RequestDetailGood>
    {
        public override void OnSubmitEntity(RequestDetailGood entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            Period period = null;

            if (state == EntityState.Added)
            {
                period = Context.Periods.FirstOrDefault(p => p.IsActive);
                if (period == null)
                    throw new NullReferenceException("دوره ای تنظیم نشده یا دوره فعال وجود ندارد");
                SetPurchaseSize(entity, period);

                if (entity.NeedQty > 0 && entity.Qty < 1)
                {
                    entity.AcceptQty = entity.NeedQty;
                    entity.Qty = entity.AcceptQty;
                }

                //var maxRow =
                //    Context.RequestDetailGoods.Where(r => r.RequestGoodID == entity.RequestGoodID).Max(r => r.Row);
                ////maxRow = maxRow ?? 0;
                //entity.Row = maxRow + 1;
            }

            if (state == EntityState.Modified)
            {
                var requestDetailGood =
                    Context.RequestDetailGoods.IncludeX(rdg => rdg.RequestGood).IncludeX(rdg=>rdg.RequestGood.Period).FirstOrDefault(rdg => rdg.ID == entity.ID);
                period = entity.RequestGood.Period;
                if (period == null)
                    throw new NullReferenceException("دوره ای تنظیم نشده ");
                SetPurchaseSize(entity,period);

                var orginalIsCancel = originalValues.First(ov => ov.Key == "IsCancel").Value as bool? == true;
                if (orginalIsCancel)
                {
                    entity.IsCancel = true;
                    throw new ValidationExceptionX("ردیف جاری لغو شده است ، امکان تغییر وجود ندارد", null)
                    {
                        BadProp = "IsCancel",
                        EntityInError = entity
                    };
                }

                if (entity.AcceptQty != GetOrginalValue(originalValues, ov => ov.AcceptQty).Cast<Double>())
                    entity.Qty = entity.AcceptQty;

                //Create Input Inventory
                if (entity.RequestGood.Status == RequestStatus.PurchasingOfficer)
                {
                    var lastDoneDate = GetOrginalValue(originalValues, ov => ov.DoneDate).Convert<DateTime?>();
                    var hasNoDoneDate =
                        Context.RequestDetailGoods.Any(
                            rdg => rdg.RequestGoodID == entity.RequestGoodID && rdg.ID != entity.ID && rdg.DoneDate == null);
                    if (entity.DoneDate != null && lastDoneDate == null && !hasNoDoneDate)
                    {
                        entity.RequestGood.Status = RequestStatus.OrderDone;
                        var entry = Context.Entry(entity.RequestGood);
                        entry.State = EntityState.Modified;
                    }
                        
                }
            }

            

            base.OnSubmitEntity(entity, state, originalValues);
        }

        private void SetPurchaseSize(RequestDetailGood entity, Period period)
        {
            var middleAtleast = period.MiddleTransactionAtleast;
            var effectiveCostGoodDetails = Context.EffectiveCostGoodDetails.Include("CostType").Where(ecf => ecf.RequestDetailGoodID == entity.ID).ToList();

            double sumEffectiveCost = 0;

            if (entity.EffectiveCostGoodDetails != null)
            {
                if (entity.EffectiveCostGoodDetails.Any())
                {
                    entity.EffectiveCostGoodDetails.ForEach(e =>
                    {
                        if (e.CostType == null)
                            e.CostType = Context.CostTypes.FirstOrDefault(ct => ct.ID == e.CostTypeID);
                    });

                    sumEffectiveCost =
                        entity.EffectiveCostGoodDetails.Sum(
                            efc => efc.CostType.NatureCost == NatureCost.Positive ? efc.Cost : efc.Cost * -1);
                }
            }

            var total = entity.TotalPrice + sumEffectiveCost;
            entity.PurchaseSize = total >= middleAtleast ? PurchaseSize.Middle : PurchaseSize.Small;
        }
    }
}
