using System;
using System.Linq;
using System.Web.Http;
using DataAccess;
using Model;

namespace Web.Controllers
{
    public class DefaultsController : BreezeBaseController
    {
        [HttpGet]
        public User CurrentUser()
        {
            var context = _contextProvider.Context;
            var username = System.Web.HttpContext.Current.User.Identity.Name;
            var user = context.Users.FirstOrDefault(u => u.Username == username);
            //user.Employee = null;
            return user;
        }

        [HttpGet]
        public object CurrentPeriod()
        {
            var context = new AppDbContext();
            if (!context.Periods.Any(p => p.IsActive))
            {
                if (!context.Periods.Any())
                    throw new Exception("هیچ دوره وجود ندارد");

                var lastPeriod = context.Periods.LastOrDefault();
                if (lastPeriod != null) lastPeriod.IsActive = true;
                context.SaveChanges();
            }
            var period = context.Periods.FirstOrDefault(p => p.IsActive);
            return period;
        }

    }
}
