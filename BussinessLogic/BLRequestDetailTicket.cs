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
    public class BLRequestDetailTicket : BLBase<RequestDetailTicket>
    {
        public override void OnSubmitEntity(RequestDetailTicket entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            entity.TotalPrice = entity.GoOnPrice*entity.ReturnPrice;

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
                        var requestDetail =
                            Context.RequestDetailTickets.IncludeX(rdg => rdg.RequestTicket)
                                   .IncludeX(rdg => rdg.RequestTicket.Period)
                                   .FirstOrDefault(rdg => rdg.ID == entity.ID);
                        var period = entity.RequestTicket.Period;
                        if (period == null)
                            throw new NullReferenceException("دوره ای تنظیم نشده ");
                        SetPurchaseSize(entity, period);
                    }
                    break;
                case EntityState.Deleted:
                    {
                        var orginalDoneDate = originalValues.GetValue("DoneDate");
                        if(orginalDoneDate != null)
                            throw new Exception("ردیف جاری تاریخ انجام دارد ، امکان تغییر وجود ندارد");
                    }
                    break;
            }

            base.OnSubmitEntity(entity, state, originalValues);

        }

        private void SetPurchaseSize(RequestDetailTicket entity, Period period)
        {
            var middleAtleast = period.MiddleTransactionAtleast;
            var effectiveCostTicketDetails =
                Context.EffectiveCostTicketDetails.Include("CostType")
                       .Where(ecf => ecf.RequestDetailTicketID == entity.ID)
                       .ToList();

            double sumEffectiveCost = 0;

            if (entity.EffectiveCostTicketDetails != null)
            {
                if (entity.EffectiveCostTicketDetails.Any())
                {
                    entity.EffectiveCostTicketDetails.ForEach(e =>
                    {
                        if (e.CostType == null)
                            e.CostType = Context.CostTypes.FirstOrDefault(ct => ct.ID == e.CostTypeID);
                    });

                    sumEffectiveCost =
                        entity.EffectiveCostTicketDetails.Sum(
                            efc => efc.CostType.NatureCost == NatureCost.Positive ? efc.Cost : efc.Cost * -1);
                }
            }

            var total = entity.TotalPrice + sumEffectiveCost;
            entity.PurchaseSize = total >= middleAtleast ? PurchaseSize.Middle : PurchaseSize.Small;
        }
    }
}
