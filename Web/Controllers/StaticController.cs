﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class StaticController : Controller
    {
        public ActionResult AccessDenied()
        {
            return View();
        }

    }
}
