using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using DataAccess;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Model;

namespace Web.Test
{
    /// <summary>
    /// Summary description for UnitTest2
    /// </summary>
    [TestClass]
    public class UnitTest2
    {
        public UnitTest2()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        //
        // You can use the following additional attributes as you write your tests:
        //
        // Use ClassInitialize to run code before running the first test in the class
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // Use ClassCleanup to run code after all tests in a class have run
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // Use TestInitialize to run code before running each test 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup to run code after each test has run
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion

        [TestMethod]
        public void TestMethod1()
        {
            var context = new AppDbContext();

            var role = new Role {Name = "Admin",Title = "تیم نرمافزار"};
            var user = context.Users.First();
            var rolep = new UserInRole {RoleID = role.ID, UserID = user.ID,};

            context.Roles.Add(role);
            context.UserInRoles.Add(rolep);

            context.SaveChanges();

        }

        [TestMethod]
        public void SetPriod()
        {
            var context = new AppDbContext();

            var p = new Period {DateFrom = DateTime.Now, DateTo = DateTime.Now.AddYears(1), IsActive = true};
            context.Periods.Add(p);

            context.SaveChanges();
        }

        [TestMethod]
        public void AddUsers()
        {
            var context = new AppDbContext();

            for (int i = 0; i < 10; i++)
            {
                var newUser = new User
                {
                    Username = "user" + i,
                    Password = "123",
                    FirstName = "user" + i,
                    LastName = "user" + i
                };
                context.Users.Add(newUser);

            }

            context.SaveChanges();
        }
    }
}
