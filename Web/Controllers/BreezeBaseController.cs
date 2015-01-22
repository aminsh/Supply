using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.OData.Query;
using Breeze.WebApi;
using BussinessLogic;
using DataAccess;
using Helper.MyHelper;
using Model;
using Newtonsoft.Json.Linq;
using System.Linq.Dynamic;

namespace Web.Controllers
{
    public class AuthorizeXAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            if (!HttpContext.Current.User.Identity.IsAuthenticated)
                return false;

            var context = new AppDbContext();
            var userId = context.Users.FirstOrDefault(u => u.Username == HttpContext.Current.User.Identity.Name).ID;
            var subject = actionContext.Request.RequestUri.Segments.LastOrDefault().ToSingularize();
            return Authorization.IsUserAuthorized(userId, subject);
        }
    }
    public class MyQueryableAttribute : QueryableAttribute
    {
        public override void ValidateQuery(System.Net.Http.HttpRequestMessage request, ODataQueryOptions queryOptions)
        {
            
            base.ValidateQuery(request, queryOptions);
        }
    }

    public class EfContextProviderX : EFContextProvider<AppDbContext>
    {
        public EfContextProviderX()
            : base()
        {
        }

        protected override List<KeyMapping> SaveChangesCore(Dictionary<Type, List<EntityInfo>> saveMap)
        {
            try
            {
                return base.SaveChangesCore(saveMap);
            }
            catch (Exception exception)
            {
                if (exception.InnerException == null)
                    throw new Exception(exception.Message);

                exception = exception.InnerException;

                while (exception.InnerException != null)
                {
                    exception = exception.InnerException;
                }

                //throw new Exception(exception.Message);
                ValidationExceptionX ex;
                if (exception is ValidationExceptionX)
                    ex = exception as ValidationExceptionX;
                else if (exception.InnerException is ValidationExceptionX)
                    ex = exception.InnerException as ValidationExceptionX;
                else if (exception.InnerException is UpdateException)
                    throw new Exception(exception.InnerException.Message);
                else
                {
                    throw new Exception(exception.Message);
                    //if(exception.InnerException == null)
                    //    throw new Exception(exception.Message);

                    //exception = exception.InnerException;

                    //while (exception.InnerException != null)
                    //{
                    //    exception = exception.InnerException;
                    //}

                    //throw new Exception(exception.Message);
                }
                    

                if (ex != null)
                {
                    var entity = ex.EntityInError as Entity;
                    var propName = ex.BadProp;
                    var message = ex.Message;

                    if (entity != null)
                    {
                        var validationError = string.Format("message: '{0}',prop:'{1}',key:{2}", message, propName, entity.ID);

                        throw new ValidationExceptionX(
                            @"error = {" + validationError + "}", null);
                    }
                }
                
                throw new Exception(exception.Message);
            }
            
        }
    }

    [BreezeController]
    public class BreezeBaseController : ApiController
    {
        protected EfContextProviderX _contextProvider =new EfContextProviderX();
        
        [AllowAnonymous]
        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [AllowAnonymous]
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            SaveResult result = _contextProvider.SaveChanges(saveBundle);
            return result;
        }
        
        [HttpGet]
        public object Lookups()
        {
            //var askers = _contextProvider.Context.Askers;
            var sections = _contextProvider.Context.Sections;
            var purchasingOfficers = _contextProvider.Context.PurchasingOfficers;
            var stocks = _contextProvider.Context.Stocks;
            //var items = _contextProvider.Context.Items;

            return new { sections, purchasingOfficers, stocks};
        }
    }
}
