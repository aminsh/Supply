using System.Linq;
using System.Web.Http;
using BussinessLogic.RequestReview;
using DataAccess;
using Helper;
using Model;

namespace Web.Controllers
{
    public partial class SupplyController
    {
        [HttpGet]
        public IQueryable<RequestX> GetRequest(string param)
        {
            var context = new AppDbContext();
            var parameters = JsonHelper.ConvertToObject<Parameters>(param);
           

            return null;
        }

        [HttpGet]
        public object InitialData()
        {
            var requestTypes = EnumHelper.GetEnumXs("RequestType", typeof (RequestType));
            var purchaseSizes = EnumHelper.GetEnumXs("PurchaseSize", typeof(PurchaseSize));
            var orderStatuses = EnumHelper.GetEnumXs("OrderStatus", typeof(OrderStatus));
            var reportTypes = EnumHelper.GetEnumXs("ReportType", typeof(ReportType));
            var stepTypes = EnumHelper.GetEnumXs("StepType", typeof(StepType));

            return new
                {
                    requestTypes,
                    purchaseSizes,
                    orderStatuses,
                    reportTypes,
                    stepTypes
                };
        } 
    }
}