using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataAccess;

namespace Web.Controllers
{
    public class TasksController : Controller
    {
        public ActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
                return View();

            var context = new AppDbContext();
          
            if (context.IsUserInRole("SupplyManager"))
                return View();

            return RedirectToAction("AccessDenied", "Static");
        }

    }
}
