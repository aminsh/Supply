using System;
using System.Linq;
using System.Security;
using System.Web.Http;
using System.Web.Security;
using DataAccess;
using Model;
using Web.Security;

namespace Web.Controllers
{
    public class AccountController : ApiController
    {
        [HttpGet]
        public User Register([FromUri]RegisterUser model)
        {
            var context = new AppDbContext();

            var user = new User()
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email.Trim(),
                Password = model.Password
            };
            context.Users.Add(user);
            context.SaveChanges();
            FormsAuthentication.SetAuthCookie(model.Email, createPersistentCookie: false);

            return user;
        }

        [HttpGet]
        public User Login([FromUri]LoginUser model)
        {
            var context = new AppDbContext();
            var pass = FormsAuthentication.HashPasswordForStoringInConfigFile(model.Password, "MD5");

            var user = context.Users.FirstOrDefault(
                u =>
                u.Username.ToLower() == model.UserName.ToLower() &&
                u.Password == pass
                );

            if (user != null)
            {
                FormsAuthentication.SetAuthCookie(user.Username, model.RememberMe);
                //user.Password = "none";
                return null;
            }

            throw new SecurityException("نام کاربری یا کلمه عبور صحیح نیست");
        }

        [HttpGet]
        public Boolean IsAuthenticated()
        {
            return User.Identity.IsAuthenticated;
        }

        [HttpGet]
        public User CurrentUser()
        {
            if (!IsAuthenticated())
                return null;
            var context = new AppDbContext();
            var current = context.Users.FirstOrDefault(u => u.Username == User.Identity.Name);
            current.Password = "none";
            return current;
        }

        [HttpPost]
        [System.Web.Http.HttpGet]
        public void Logoff()
        {
            FormsAuthentication.SignOut();
        }
    }
}
