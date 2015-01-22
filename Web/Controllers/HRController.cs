using System;
using System.Linq;
using System.Web.Http;
using Model;

namespace Web.Controllers
{
    public class HRController : ApiController
    {
        [HttpGet]
        public IQueryable<Person> People()
        {
            //var proxy = new dbContext(new Uri("http://localhost:3000/HRService.svc/"));
            //var context = new AppDbContext();
            //var personnels = proxy.People;
            //var asksers = context.Askers.Select(a => new Person()
            //    {
            //        ID = a.Code,
            //        FullName = a.Title,
            //        Post = a.Position,
            //        Unit = a.Unit
            //    });
            //var list = personnels.Concat(asksers).ToList();
            //return personnels.Concat(asksers);
            return null;
        }
    }

}
