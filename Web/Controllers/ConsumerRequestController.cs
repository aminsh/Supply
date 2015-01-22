using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataAccess;

namespace Web
{
    public class ConsumerRequestController : Controller
    {
        public ActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
                return View();

            var context = new AppDbContext();
          
            if (context.IsUserInRole("Consumer"))
                return View();

            return RedirectToAction("AccessDenied","Static");
        }

        public ActionResult Confirm()
        {
            if (!User.Identity.IsAuthenticated)
                return View("Confirm");

            var context = new AppDbContext();
            var userId = context.CurrentUser().ID;
            var isInConfirmRole =
                context.SectionConfirms.Any(uir => uir.UserID == userId);

            if (isInConfirmRole)
                return View("Confirm");

            return RedirectToAction("AccessDenied", "Static");
        }

    }
}
