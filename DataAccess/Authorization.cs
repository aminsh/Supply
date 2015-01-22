using System;
using System.Data;
using System.Linq;
using System.Web;
using Model;


namespace DataAccess
{
    public partial class AppDbContext
    {
        public void Authorize(string entityName , EntityState state)
        {
            return;
            
            if(IsFirstTime)
                return;
            if(IsException(entityName))
                return;

            var authType = _LogicAssembly.GetType("BussinessLogic.Authorization");
            var method = authType.GetMethods()[1];
            var isAuthorized = method.Invoke(null, new object[] { CurrentUser().ID,entityName,state}).Cast<Boolean>();
            if (isAuthorized) return;
            var msg = string.Format("دسترسی کاربری برای انجام این عملیات تعیین نشده");
            throw new Exception(msg);
        }

        public User CurrentUser()
        {
            return HttpContext.Current.User.Identity.Name == "" 
                ? null 
                : Users.FirstOrDefault(u => u.Username == HttpContext.Current.User.Identity.Name);
        }

        public Boolean IsUserInRole(string roleName)
        {
            var user = CurrentUser();
            if (user == null)
                return false;
            
            var userId = CurrentUser().ID;

            return UserInRoles.Any(uir => uir.UserID == userId && uir.Role.Name == "Admin")
                   ||
                   UserInRoles.Any(uir => uir.UserID == userId && uir.Role.Name == roleName);
        }

        private Boolean IsException(string entityName)
        {
            var exceptions = new[] {"Subject", "User"};
            return exceptions.Contains(entityName);
        }
    }
}
