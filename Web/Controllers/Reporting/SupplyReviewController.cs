using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using BussinessLogic.RequestReview;
using Helper;

namespace Web.Controllers
{
   partial class SupplyController 
    {
        [HttpGet]
        public IEnumerable<RequestX> SelectedItemBySection(string param)
        {
            var parameters = JsonHelper.ConvertToObject<Parameters>(param);
            var rgr = new RequestGoodReview(parameters);

            var x = parameters.Section.IsNull()
                ? rgr.Sections().ToList()
                : rgr.Sections(parameters.Section.ID).ToList();
            return parameters.Section.IsNull() 
                ? rgr.Sections().ToList() 
                : rgr.Sections(parameters.Section.ID).ToList();
        }
    }
}