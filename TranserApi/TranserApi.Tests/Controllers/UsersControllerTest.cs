using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TranserApi.Controllers;
using TranserApi.Models;

namespace TranserApi.Tests.Controllers
{
    [TestClass]
    public class UsersControllerTest
    {
        [TestMethod]
        public async Task GetById()
        {
            User u = new User
            {
                name = "test",
                userID = "test",
                status = "active",
                mainbalance = 0,
                createDate = null
            };
            // Arrange
            var testUsers = GetTestUsers();
            var controller = new UsersController();
            await controller.PostUser(u);

            var result = controller.GetUsers() as List<User>;
            Assert.AreEqual(testUsers.Count, result.Count);

        }

        private List<User> GetTestUsers()
        {
            var testUsers = new List<User>();
            testUsers.Add(new User
            {
                name = "test",
                userID = "test",
                status = "active",
                mainbalance= 0,
                createDate= null
            });
           

            return testUsers;
        }
    }


}
