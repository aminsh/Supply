using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using BussinessLogic;
using DataAccess;
using Model;

namespace Web.Controllers
{
    public partial class SupplyController 
    {
        [HttpGet]
        [AllowAnonymous]
        public Double GetInventrory(Int32 itemGoodId)
        {
            var context = _contextProvider.Context;

            var periodId = context.Periods.FirstOrDefault(p => p.IsActive).ID;

            double inputQty = 0;
            if (context.InputDetails.Any(
                            id =>
                                id.Input.PeriodID == periodId && id.ItemGoodID == itemGoodId))
            {
                inputQty = context.InputDetails.Where(
                    id =>
                    id.Input.PeriodID == periodId && id.ItemGoodID == itemGoodId)
                                  .Sum(id => id.Qty);
            }
            double outputQty = 0;
            if (context.OutputDetails.Any(
                    od => od.Output.PeriodID == periodId && od.ItemGoodID == itemGoodId))
            {
                outputQty =
                    context.OutputDetails.Where(
                        od => od.Output.PeriodID == periodId && od.ItemGoodID == itemGoodId)
                           .Sum(od => od.Qty);
            }

            var rem = inputQty - outputQty;

            return rem;
        }

        [HttpGet]
        [AllowAnonymous]
        public Input CreateNewInput(Int32 requestGoodId,String requestDetail)
        {
            var context = _contextProvider.Context;
            var requestDetailIDList = new int[] {};

            if (requestDetail == string.Empty)
            {
                if (!context.RequestDetailGoods.Any(
                rdg =>
                rdg.RequestGoodID == requestGoodId && !rdg.IsCancel && rdg.IsOrder && rdg.DoneDate != null &&
                rdg.InputDetailID == null))
                    throw new Exception("ردیفی برای صدور رسید وجود ندارد");
            }

            if(requestDetail != string.Empty)
            {
                requestDetailIDList = requestDetail.Split(';').Select(p => p.Convert<int>()).ToArray();
                if (!context.RequestDetailGoods.Any(
                    rdg =>
                    rdg.RequestGoodID == requestGoodId && !rdg.IsCancel && rdg.IsOrder && rdg.DoneDate != null &&
                    rdg.InputDetailID == null &&
                    requestDetailIDList.Contains(rdg.ID)))
                    throw new Exception("ردیفی برای صدور رسید وجود ندارد"); 
            }

            var requestGood =
                    context.RequestGoods.IncludeX(rg => rg.PurchasingOfficer)
                           .FirstOrDefault(rg => rg.ID == requestGoodId);

            if(requestGood.IsNull())
                throw new ArgumentNullException("requestGoodId");

            List<RequestDetailGood> requestDetails;

                if (requestDetail == string.Empty)
                {
                    requestDetails =
                        context.RequestDetailGoods.Where(
                            rdg =>
                            rdg.RequestGoodID == requestGood.ID && rdg.IsOrder && rdg.DoneDate != null &&
                            rdg.InputDetailID == null).ToList();
                } 
                else
                {
                    requestDetails =
                        context.RequestDetailGoods.Where(
                            rdg =>
                            rdg.RequestGoodID == requestGood.ID && rdg.IsOrder && rdg.DoneDate != null &&
                            rdg.InputDetailID == null && 
                            requestDetailIDList.Contains(rdg.ID)).ToList();
                }

            var blInput = new BLInput {Context = context};
            var input = blInput.CreateInput(requestGood, requestDetails);

            context.SaveChanges();

            return input;
        }

        [HttpGet]
        [AllowAnonymous]
        public Output CreateNewOutput(Int32 requestGoodId, String requestDetail)
        {
            var context = _contextProvider.Context;
            var requestDetailIDList = new int[] { };

            if (requestDetail == string.Empty)
            {
                if (!context.RequestDetailGoods.Any(
                rdg =>
                rdg.RequestGoodID == requestGoodId && !rdg.IsCancel &&
                ((rdg.IsOrder && rdg.DoneDate != null && rdg.OutputDetailID == null) || (!rdg.IsOrder))))
                    throw new Exception("ردیفی برای صدور حواله یافت نشد");
            }

            if (requestDetail != string.Empty)
            {
                requestDetailIDList = requestDetail.Split(';').Select(p => p.Convert<int>()).ToArray();

                if (!context.RequestDetailGoods.Any(
                rdg =>
                rdg.RequestGoodID == requestGoodId && !rdg.IsCancel &&
                requestDetailIDList.Contains(rdg.ID) &&
                ((rdg.IsOrder && rdg.DoneDate != null && rdg.OutputDetailID == null) || (!rdg.IsOrder))))
                    throw new Exception("ردیفی برای صدور حواله یافت نشد");
            }

            var requestGood =
                    context.RequestGoods.FirstOrDefault(rg => rg.ID == requestGoodId);

                List<RequestDetailGood> requestDetailGoods;
                if (requestDetail == string.Empty)
                {
                    requestDetailGoods =
                        context.RequestDetailGoods.Where(
                            rdg => rdg.RequestGoodID == requestGood.ID && !rdg.IsCancel &&
                                   ((rdg.IsOrder && rdg.DoneDate != null && rdg.OutputDetailID == null) ||
                                    (!rdg.IsOrder))).ToList();
                }
                else
                {
                    requestDetailGoods =
                        context.RequestDetailGoods.Where(
                            rdg => rdg.RequestGoodID == requestGood.ID && !rdg.IsCancel &&
                                   requestDetailIDList.Contains(rdg.ID) &&
                                   ((rdg.IsOrder && rdg.DoneDate != null && rdg.OutputDetailID == null) ||
                                    (!rdg.IsOrder))).ToList();
                }

            var bloutput = new BLOutput {Context = context};
            var output = bloutput.CreateOutput(requestGood, requestDetailGoods);
            context.SaveChanges();

            if (!context.RequestDetailGoods.Any(
                rdg =>
                rdg.RequestGoodID == requestGoodId && !rdg.IsCancel &&
                ((rdg.IsOrder && rdg.DoneDate != null && rdg.OutputDetailID == null) || (!rdg.IsOrder))))
            {
                var blStep = new BLRequestStep() { Context = context };
                var last = blStep.GetLastStep(requestGoodId);
                blStep.CloseStep(last);
            }
            context.SaveChanges();
            return output;
        }

        [HttpGet]
        [AllowAnonymous]
        public IQueryable<RequestGood> CreateExistsInput(Int32 requestGoodId, Int32 inpuId)
        {
            return null;
        }

        [HttpGet]
        [AllowAnonymous]
        public IQueryable<RequestGood> CreateExistsOutput(Int32 requestGoodId, Int32 inpuId)
        {
            return null;
        }
    }
}
