using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace BussinessLogic
{
    public class BLRequestTicket : BLBase<RequestTicket>
    {
        public override void OnSubmitEntity(RequestTicket entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            var period = Context.Periods.FirstOrDefault(p => p.IsActive);
            if (period == null)
                throw new NullReferenceException("دوره ای تنظیم نشده یا دوره فعال وجود ندارد");


            if (entity.PurchasingOfficerID != null && entity.OrderDate == null)
                throw new ValidationExceptionX("تاریخ ارائه به کارپرداز الزامی است", null)
                {
                    BadProp = "OrderDate",
                    EntityInError = entity
                };
            if (entity.PurchasingOfficerID == null && entity.OrderDate != null)
                throw new ValidationExceptionX("کارپرداز الزامی است", null)
                {
                    BadProp = "PurchasingOfficerID",
                    EntityInError = entity
                };

            switch (state)
            {
                case EntityState.Added:
                    {
                        entity.PeriodID = period.ID;
                        entity.CreatedOnDate = DateTime.Now;
                        entity.CreatedByUserID = 1;

                        //Generate OrderNo  شماره سفارش خرید
                        if (entity.HasOrder)
                        {
                            var maxNo = Context.Requests.Where(r => r.PeriodID == period.ID).Max(r => r.OrderNo);
                            maxNo = maxNo ?? 0;
                            entity.OrderNo = maxNo + 1;
                        }

                        //وارد کارتابل کردن درخواست جاری
                        (new BLRequestStep() { Context = Context }).FirstStep(entity.ID);
                    }
                    break;
                case EntityState.Modified:
                    {
                        // Remove Request procedure 
                        if (entity.Status == RequestStatus.Cancel)
                            entity.OrderNo = entity.ID * -1;

                        //Generate OrderNo  شماره سفارش خرید
                        var lastHasOrder = GetOrginalValue(originalValues, ov => ov.HasOrder).Cast<Boolean>();

                        if (lastHasOrder && !entity.HasOrder)
                        {
                            var maxNo = Context.Requests.Where(r => r.PeriodID == period.ID).Max(r => r.OrderNo);
                            maxNo = maxNo ?? 0;
                            entity.OrderNo = maxNo + 1;
                        } 
                    }
                    break;
                case EntityState.Deleted:
                    {
                        Context.Entry(entity).State = EntityState.Modified;
                        entity.Status = RequestStatus.Cancel;
                    }
                    break;
            }

            base.OnSubmitEntity(entity, state, originalValues);
        }
    }
}
