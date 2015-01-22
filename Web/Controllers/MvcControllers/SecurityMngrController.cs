using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataAccess;

namespace Web.Controllers
{
    public class SecurityMngrController : Controller
    {
        public ActionResult Index()
        {
            var context = new AppDbContext();

            if (context.IsUserInRole("Manager"))
                return View();

            return RedirectToAction("AccessDenied", "Static");
        }

    }
}
