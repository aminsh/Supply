using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Objects;
using System.Data.Objects.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using BussinessLogic;
using BussinessLogic.RequestReview;
using DataAccess;
using Helper.Extensions;
using Helper.MyHelper;
using Model;
using Web.Security;
using WebMatrix.WebData;

namespace Web
{

    public class HotTowelController : Controller
    {
        public ActionResult Index()
        {
            var context = new AppDbContext();
            
            if (!context.IsUserInRole("Supply"))
                return RedirectToAction("AccessDenied", "Static");

            return View();
        }

        public ActionResult Login(LoginUser model,String returnUrl)
        {
            if (ModelState.IsValid)
            {
                var context = new AppDbContext();
                var pass = FormsAuthentication.HashPasswordForStoringInConfigFile(model.Password, "MD5");

                var isValid = context.Users.Any(u => u.Username == model.UserName && u.Password == pass);
                if (isValid)
                {
                    FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);
                    return RedirectToLocal(returnUrl);
                }
                   
                    
            }
            ModelState.AddModelError("", "The user name or password provided is incorrect.");
            return View("index",model);
            // If we got this far, something failed
            //return Json(new { errors = GetErrorsFromModelState() });
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Register(RegisterUser model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                // Attempt to register the user
                try
                {
                    var pass = FormsAuthentication.HashPasswordForStoringInConfigFile(model.Password, "MD5");
                    var context = new AppDbContext();
                    var user = new User()
                    {
                        Username = model.Username,
                        Password = pass
                    };
                    context.Users.Add(user);
                    context.SaveChanges();
                    FormsAuthentication.SetAuthCookie(model.Username, createPersistentCookie: false);
                    return RedirectToLocal(returnUrl);
                }
                catch (MembershipCreateUserException e)
                {
                    ModelState.AddModelError("", ErrorCodeToString(e.StatusCode));
                    return View("index", model);
                }
            }
            return View("index", model);
        }

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();

            return RedirectToAction("Index");
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "User name already exists. Please enter a different user name.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "A user name for that e-mail address already exists. Please enter a different e-mail address.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }

    }
}
