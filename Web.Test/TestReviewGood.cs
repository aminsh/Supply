using System;
using System.Configuration;
using System.Data;
using System.Data.Objects.DataClasses;
using System.Data.Objects.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Security;
using BussinessLogic.RequestReview;
using DataAccess;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Model;

namespace Web.Test
{
    [TestClass]
    public class UnitTest1
    {
        [TestInitialize]
        public void Init()
        {
            
        }

        [TestMethod]
        public void RequestGoodReview_Sections()
        {
            var context = new AppDbContext();
            var param = new Parameters { Section = new Section { ID = 12410 } };

            var review = new RequestGoodReview(param);
            var list = review.Sections(12400).ToList();
        }

        [TestMethod]
        public void RequestGoodReview_Items()
        {
            var context = new AppDbContext();
            var param = new Parameters {};

            var review = new RequestGoodReview(param);
            var list = review.Items().ToList();
        }
    }

    public sealed class Sf
    {
        [EdmFunction("SqlServer", "STR")]
        public static System.String StringConvert(System.Int32? number)
        {
            throw new Exception("");
        }
    }
}
